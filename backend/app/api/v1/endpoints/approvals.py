"""
Approval workflow endpoints for requirement approvals
"""
from datetime import datetime
from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, require_role
from app.core.database import get_db
from app.models.approval import Approval, ApprovalStatus, ApprovalStage
from app.models.requirement import Requirement, RequirementStatus
from app.models.user import User
from app.schemas.requirement import RequirementResponse
from pydantic import BaseModel
from sqlalchemy.orm import selectinload

router = APIRouter()


class ApprovalActionRequest(BaseModel):
    """Request schema for approval actions"""
    comments: str | None = None


class ApprovalResponse(BaseModel):
    """Response schema for approval"""
    id: UUID
    requirement_id: UUID
    approver_id: UUID
    approval_stage: str
    status: str
    comments: str | None
    submitted_at: datetime
    reviewed_at: datetime | None
    
    class Config:
        from_attributes = True


class PendingApprovalItem(BaseModel):
    """Response schema for pending approval with requirement details"""
    approval_id: UUID
    approval_stage: str
    submitted_at: datetime
    requirement: RequirementResponse
    submitter_name: str | None = None
    submitter_email: str | None = None
    
    class Config:
        from_attributes = True


@router.get("/pending", response_model=List[PendingApprovalItem])
async def get_pending_approvals(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get all pending approvals for the current user.
    Returns requirements that need approval from the logged-in user.
    """
    # Get pending approvals with related requirement data
    result = await db.execute(
        select(Approval)
        .options(
            selectinload(Approval.requirement).selectinload(Requirement.hiring_manager)
        )
        .where(
            and_(
                Approval.approver_id == current_user.id,
                Approval.status == ApprovalStatus.PENDING
            )
        )
        .order_by(Approval.submitted_at.desc())
    )
    approvals = result.scalars().all()
    
    # Transform to response format
    pending_items = []
    for approval in approvals:
        if approval.requirement and not approval.requirement.deleted_at:
            hiring_manager = approval.requirement.hiring_manager
            pending_items.append({
                "approval_id": approval.id,
                "approval_stage": approval.approval_stage.value,
                "submitted_at": approval.submitted_at,
                "requirement": approval.requirement,
                "submitter_name": hiring_manager.full_name if hiring_manager else None,
                "submitter_email": hiring_manager.email if hiring_manager else None
            })
    
    return pending_items


@router.get("/{requirement_id}/approvals", response_model=List[ApprovalResponse])
async def get_requirement_approvals(
    requirement_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get all approvals for a requirement"""
    result = await db.execute(
        select(Approval)
        .where(Approval.requirement_id == requirement_id)
        .order_by(Approval.submitted_at)
    )
    approvals = result.scalars().all()
    return approvals


@router.post("/{requirement_id}/approve", response_model=ApprovalResponse)
async def approve_requirement(
    requirement_id: UUID,
    action: ApprovalActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("approver")),
) -> Any:
    """Approve a requirement at current stage"""
    # Find pending approval for this user
    result = await db.execute(
        select(Approval).where(
            and_(
                Approval.requirement_id == requirement_id,
                Approval.approver_id == current_user.id,
                Approval.status == ApprovalStatus.PENDING
            )
        )
    )
    approval = result.scalar_one_or_none()
    
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending approval found for this user"
        )
    
    # Update approval
    approval.status = ApprovalStatus.APPROVED
    approval.reviewed_at = datetime.utcnow()
    approval.comments = action.comments
    
    # Check if all approvals are complete
    all_approvals_result = await db.execute(
        select(Approval).where(Approval.requirement_id == requirement_id)
    )
    all_approvals = all_approvals_result.scalars().all()
    
    all_approved = all(a.status == ApprovalStatus.APPROVED or a.id == approval.id for a in all_approvals)
    
    # Update requirement status if all approved
    if all_approved:
        req_result = await db.execute(
            select(Requirement).where(Requirement.id == requirement_id)
        )
        requirement = req_result.scalar_one()
        requirement.status = RequirementStatus.APPROVED
        requirement.approved_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(approval)
    
    return approval


@router.post("/{requirement_id}/reject", response_model=ApprovalResponse)
async def reject_requirement(
    requirement_id: UUID,
    action: ApprovalActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("approver")),
) -> Any:
    """Reject a requirement at current stage"""
    # Find pending approval for this user
    result = await db.execute(
        select(Approval).where(
            and_(
                Approval.requirement_id == requirement_id,
                Approval.approver_id == current_user.id,
                Approval.status == ApprovalStatus.PENDING
            )
        )
    )
    approval = result.scalar_one_or_none()
    
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending approval found for this user"
        )
    
    # Update approval
    approval.status = ApprovalStatus.REJECTED
    approval.reviewed_at = datetime.utcnow()
    approval.comments = action.comments
    
    # Update requirement status
    req_result = await db.execute(
        select(Requirement).where(Requirement.id == requirement_id)
    )
    requirement = req_result.scalar_one()
    requirement.status = RequirementStatus.REJECTED
    
    await db.commit()
    await db.refresh(approval)
    
    return approval
