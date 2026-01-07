"""
Approval workflow endpoints for requirement approvals
"""
from datetime import datetime
from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, require_role
from app.core.database import get_db
from app.models.approval import Approval, ApprovalStatus, ApprovalStage
from app.models.requirement import Requirement, RequirementStatus
from app.models.user import User
from pydantic import BaseModel

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
