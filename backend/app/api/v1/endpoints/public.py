"""Public API endpoints - No authentication required."""
from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.requirement import Requirement, RequirementStatus, PostingStatus
from app.schemas.requirement import JobPostingResponse, PublicJobListResponse

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/jobs", response_model=PublicJobListResponse)
async def list_public_jobs(
    department: str | None = None,
    location: str | None = None,
    employment_type: str | None = None,
    work_mode: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get list of active job postings for public careers page.
    No authentication required.
    """
    query = select(Requirement).where(
        and_(
            Requirement.deleted_at.is_(None),
            Requirement.is_posted == True,
            Requirement.posting_status == PostingStatus.ACTIVE,
            Requirement.status.in_([RequirementStatus.ACTIVE, RequirementStatus.APPROVED])
        )
    )
    
    # Apply filters
    if department:
        query = query.join(Requirement.department).where(
            Requirement.department.has(name=department)
        )
    
    if location:
        query = query.join(Requirement.location).where(
            Requirement.location.has(name=location)
        )
    
    if employment_type:
        query = query.where(Requirement.employment_type == employment_type)
    
    if work_mode:
        query = query.where(Requirement.work_mode == work_mode)
    
    # Get total count
    from sqlalchemy import func
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Get paginated results
    query = query.offset(skip).limit(limit).order_by(Requirement.posted_at.desc())
    result = await db.execute(query)
    requirements = result.scalars().all()
    
    # Build response
    items = []
    for req in requirements:
        posting_details = req.posting_details or {}
        items.append({
            "id": req.id,
            "requirement_number": req.requirement_number,
            "position_title": req.position_title,
            "department_name": req.department.name if req.department else "N/A",
            "location_name": req.location.name if req.location else "N/A",
            "employment_type": req.employment_type.value,
            "work_mode": req.work_mode.value,
            "job_description": posting_details.get("custom_description") or req.job_description,
            "required_qualifications": req.required_qualifications,
            "required_skills": req.required_skills or [],
            "min_salary": float(req.min_salary) if req.min_salary else None,
            "max_salary": float(req.max_salary) if req.max_salary else None,
            "currency": req.currency,
            "is_posted": req.is_posted,
            "posting_status": req.posting_status.value,
            "posting_channels": req.posting_channels or [],
            "job_posting_url": req.job_posting_url,
            "posted_at": req.posted_at,
            "benefits": posting_details.get("benefits"),
            "application_instructions": posting_details.get("application_instructions"),
        })
    
    return {
        "items": items,
        "total": total,
    }


@router.get("/jobs/{job_slug}", response_model=JobPostingResponse)
async def get_public_job_detail(
    job_slug: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get detailed job posting by URL slug.
    No authentication required.
    URL slug is typically the requirement number (e.g., 'req-00001')
    """
    # Parse requirement number from slug
    requirement_number = job_slug.upper()
    if not requirement_number.startswith("REQ-"):
        requirement_number = f"REQ-{job_slug.upper()}"
    
    # Get requirement
    result = await db.execute(
        select(Requirement).where(
            and_(
                Requirement.requirement_number == requirement_number,
                Requirement.deleted_at.is_(None),
                Requirement.is_posted == True,
                Requirement.posting_status == PostingStatus.ACTIVE
            )
        )
    )
    requirement = result.scalar_one_or_none()
    
    if not requirement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found"
        )
    
    # Build response
    posting_details = requirement.posting_details or {}
    
    return {
        "id": requirement.id,
        "requirement_number": requirement.requirement_number,
        "position_title": requirement.position_title,
        "department_name": requirement.department.name if requirement.department else "N/A",
        "location_name": requirement.location.name if requirement.location else "N/A",
        "employment_type": requirement.employment_type.value,
        "work_mode": requirement.work_mode.value,
        "job_description": posting_details.get("custom_description") or requirement.job_description,
        "required_qualifications": requirement.required_qualifications,
        "required_skills": requirement.required_skills or [],
        "min_salary": float(requirement.min_salary) if requirement.min_salary else None,
        "max_salary": float(requirement.max_salary) if requirement.max_salary else None,
        "currency": requirement.currency,
        "is_posted": requirement.is_posted,
        "posting_status": requirement.posting_status.value,
        "posting_channels": requirement.posting_channels or [],
        "job_posting_url": requirement.job_posting_url,
        "posted_at": requirement.posted_at,
        "benefits": posting_details.get("benefits"),
        "application_instructions": posting_details.get("application_instructions"),
    }
