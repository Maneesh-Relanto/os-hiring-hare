"""Requirement API endpoints."""
from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.requirement import Requirement
from app.schemas.requirement import (
    RequirementCreate,
    RequirementUpdate,
    RequirementResponse,
    RequirementListResponse,
)

router = APIRouter(prefix="/requirements", tags=["requirements"])


@router.get("", response_model=RequirementListResponse)
async def list_requirements(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get list of requirements with pagination and filters."""
    query = select(Requirement).where(Requirement.deleted_at.is_(None))
    
    # Apply filters
    if status:
        query = query.where(Requirement.status == status)
    
    if search:
        query = query.where(
            Requirement.position_title.ilike(f"%{search}%") |
            Requirement.requirement_number.ilike(f"%{search}%")
        )
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Get paginated results
    query = query.offset(skip).limit(limit).order_by(Requirement.created_at.desc())
    result = await db.execute(query)
    requirements = result.scalars().all()
    
    return {
        "items": requirements,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "total_pages": (total + limit - 1) // limit,
    }


@router.post("", response_model=RequirementResponse, status_code=status.HTTP_201_CREATED)
async def create_requirement(
    requirement_data: RequirementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a new requirement."""
    # Generate requirement number
    count_result = await db.execute(
        select(func.count()).select_from(Requirement)
    )
    count = count_result.scalar_one()
    requirement_number = f"REQ-{count + 1:05d}"
    
    requirement = Requirement(
        requirement_number=requirement_number,
        position_title=requirement_data.position_title,
        department_id=requirement_data.department_id,
        job_level_id=requirement_data.job_level_id,
        location_id=requirement_data.location_id,
        reporting_to_user_id=requirement_data.reporting_to_user_id,
        requirement_type=requirement_data.requirement_type,
        employment_type=requirement_data.employment_type,
        work_mode=requirement_data.work_mode,
        number_of_positions=requirement_data.number_of_positions,
        priority=requirement_data.priority,
        job_description=requirement_data.job_description,
        key_responsibilities=requirement_data.key_responsibilities,
        required_qualifications=requirement_data.required_qualifications,
        preferred_qualifications=requirement_data.preferred_qualifications,
        required_skills=requirement_data.required_skills,
        min_salary=requirement_data.min_salary,
        max_salary=requirement_data.max_salary,
        currency=requirement_data.currency,
        additional_compensation=requirement_data.additional_compensation,
        target_start_date=requirement_data.target_start_date,
        expected_closure_date=requirement_data.expected_closure_date,
        justification=requirement_data.justification,
        status="DRAFT",
        created_by=current_user.id,
        hiring_manager_id=current_user.id,
    )
    
    db.add(requirement)
    await db.commit()
    await db.refresh(requirement)
    
    return requirement


@router.get("/{requirement_id}", response_model=RequirementResponse)
async def get_requirement(
    requirement_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get requirement by ID."""
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
    
    return requirement


@router.put("/{requirement_id}", response_model=RequirementResponse)
async def update_requirement(
    requirement_id: UUID,
    requirement_data: RequirementUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update a requirement."""
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
    
    # Update fields
    update_data = requirement_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(requirement, field, value)
    
    await db.commit()
    await db.refresh(requirement)
    
    return requirement


@router.delete("/{requirement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requirement(
    requirement_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Soft delete a requirement."""
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
    
    requirement.soft_delete()
    await db.commit()
