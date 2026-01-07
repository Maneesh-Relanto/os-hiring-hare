"""Requirement schemas for API requests and responses."""
from datetime import date, datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field


class RequirementBase(BaseModel):
    """Base requirement schema."""
    position_title: str = Field(..., min_length=1, max_length=200)
    department_id: UUID
    job_level_id: UUID
    location_id: UUID
    reporting_to_user_id: Optional[UUID] = None
    requirement_type: str
    employment_type: str
    work_mode: str
    number_of_positions: int = Field(..., ge=1)
    priority: str
    job_description: str
    key_responsibilities: Optional[str] = None
    required_qualifications: str
    preferred_qualifications: Optional[str] = None
    required_skills: List[str] = Field(default_factory=list)
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    currency: str = "USD"
    additional_compensation: Optional[str] = None
    target_start_date: Optional[date] = None
    expected_closure_date: Optional[date] = None
    justification: str


class RequirementCreate(RequirementBase):
    """Schema for creating a requirement."""
    pass


class RequirementUpdate(BaseModel):
    """Schema for updating a requirement."""
    position_title: Optional[str] = Field(None, min_length=1, max_length=200)
    department_id: Optional[UUID] = None
    job_level_id: Optional[UUID] = None
    location_id: Optional[UUID] = None
    reporting_to_user_id: Optional[UUID] = None
    requirement_type: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    number_of_positions: Optional[int] = Field(None, ge=1)
    priority: Optional[str] = None
    job_description: Optional[str] = None
    key_responsibilities: Optional[str] = None
    required_qualifications: Optional[str] = None
    preferred_qualifications: Optional[str] = None
    required_skills: Optional[List[str]] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    currency: Optional[str] = None
    additional_compensation: Optional[str] = None
    target_start_date: Optional[date] = None
    expected_closure_date: Optional[date] = None
    justification: Optional[str] = None
    status: Optional[str] = None


class RequirementResponse(RequirementBase):
    """Schema for requirement response."""
    id: UUID
    requirement_number: str
    status: str
    created_by: UUID
    hiring_manager_id: UUID
    assigned_recruiter_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime]
    approved_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class RequirementListResponse(BaseModel):
    """Schema for paginated requirement list."""
    items: List[RequirementResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
