"""Job postings API endpoints."""
from datetime import datetime
from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.user import User
from app.models.requirement import Requirement, RequirementStatus, PostingStatus
from app.schemas.requirement import (
    RequirementResponse,
    RequirementListResponse,
    UpdatePostingRequest,
)

router = APIRouter(prefix="/postings", tags=["postings"])


@router.get("", response_model=RequirementListResponse)
async def list_postings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    posting_status: str | None = None,
    department: str | None = None,
    channel: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get list of all job postings.
    Only returns requirements that have been posted (is_posted = True).
    Accessible to all authenticated users.
    """
    # Base query - only posted requirements
    query = select(Requirement).where(
        Requirement.deleted_at.is_(None),
        Requirement.is_posted == True  # noqa: E712
    )
    
    # Apply filters
    if posting_status:
        query = query.where(Requirement.posting_status == posting_status)
    
    if department:
        query = query.where(Requirement.department == department)
    
    if channel:
        # Filter by channel in posting_channels JSONB array
        query = query.where(
            func.jsonb_exists(Requirement.posting_channels, channel)
        )
    
    if search:
        query = query.where(
            or_(
                Requirement.position_title.ilike(f"%{search}%"),
                Requirement.requirement_number.ilike(f"%{search}%"),
                Requirement.job_description.ilike(f"%{search}%")
            )
        )
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Get paginated results, ordered by posted date (newest first)
    query = query.offset(skip).limit(limit).order_by(Requirement.posted_at.desc())
    result = await db.execute(query)
    requirements = result.scalars().all()
    
    return {
        "items": requirements,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get("/stats")
async def get_posting_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get statistics about job postings."""
    
    # Count by posting status
    active_count = await db.scalar(
        select(func.count())
        .select_from(Requirement)
        .where(
            Requirement.deleted_at.is_(None),
            Requirement.is_posted == True,  # noqa: E712
            Requirement.posting_status == PostingStatus.ACTIVE
        )
    )
    
    paused_count = await db.scalar(
        select(func.count())
        .select_from(Requirement)
        .where(
            Requirement.deleted_at.is_(None),
            Requirement.is_posted == True,  # noqa: E712
            Requirement.posting_status == PostingStatus.PAUSED
        )
    )
    
    closed_count = await db.scalar(
        select(func.count())
        .select_from(Requirement)
        .where(
            Requirement.deleted_at.is_(None),
            Requirement.is_posted == True,  # noqa: E712
            Requirement.posting_status == PostingStatus.CLOSED
        )
    )
    
    draft_count = await db.scalar(
        select(func.count())
        .select_from(Requirement)
        .where(
            Requirement.deleted_at.is_(None),
            Requirement.is_posted == True,  # noqa: E712
            Requirement.posting_status == PostingStatus.DRAFT
        )
    )
    
    total_posted = await db.scalar(
        select(func.count())
        .select_from(Requirement)
        .where(
            Requirement.deleted_at.is_(None),
            Requirement.is_posted == True  # noqa: E712
        )
    )
    
    return {
        "total_posted": total_posted or 0,
        "active": active_count or 0,
        "paused": paused_count or 0,
        "closed": closed_count or 0,
        "draft": draft_count or 0,
    }


@router.put("/{requirement_id}/status", response_model=RequirementResponse)
async def update_posting_status(
    requirement_id: UUID,
    update_data: UpdatePostingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update posting status (pause, reactivate, close).
    Only the assigned recruiter or admin can update.
    """
    # Fetch the requirement
    result = await db.execute(
        select(Requirement).where(
            Requirement.id == requirement_id,
            Requirement.deleted_at.is_(None)
        )
    )
    requirement = result.scalar_one_or_none()
    
    if not requirement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found"
        )
    
    if not requirement.is_posted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This requirement has not been posted yet"
        )
    
    # Check permissions: must be assigned recruiter or admin
    is_admin = any(role.name == "admin" for role in current_user.roles)
    is_assigned_recruiter = requirement.recruiter_id == current_user.id
    
    if not (is_admin or is_assigned_recruiter):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned recruiter or admin can update posting status"
        )
    
    # Update posting status
    if update_data.posting_status:
        requirement.posting_status = PostingStatus(update_data.posting_status)
    
    # Update channels if provided
    if update_data.channels is not None:
        requirement.posting_channels = update_data.channels
    
    # Update benefits if provided
    if update_data.benefits is not None:
        if requirement.posting_details is None:
            requirement.posting_details = {}
        requirement.posting_details["benefits"] = update_data.benefits
    
    # Update custom description if provided
    if update_data.custom_description is not None:
        if requirement.posting_details is None:
            requirement.posting_details = {}
        requirement.posting_details["custom_description"] = update_data.custom_description
    
    # Update application instructions if provided
    if update_data.application_instructions is not None:
        if requirement.posting_details is None:
            requirement.posting_details = {}
        requirement.posting_details["application_instructions"] = update_data.application_instructions
    
    await db.commit()
    await db.refresh(requirement)
    
    return requirement
