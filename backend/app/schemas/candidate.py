"""Candidate schemas for API requests and responses."""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class CandidateBase(BaseModel):
    """Base candidate schema."""
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    requirement_id: UUID
    status: str = "new"
    resume_url: Optional[str] = Field(None, max_length=500)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    portfolio_url: Optional[str] = Field(None, max_length=500)
    current_company: Optional[str] = Field(None, max_length=200)
    current_title: Optional[str] = Field(None, max_length=200)
    total_experience_years: Optional[str] = Field(None, max_length=20)
    skills: Optional[dict] = Field(default_factory=dict)
    source: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    assigned_recruiter_id: Optional[UUID] = None


class CandidateCreate(CandidateBase):
    """Schema for creating a candidate."""
    pass


class CandidateUpdate(BaseModel):
    """Schema for updating a candidate."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = None
    resume_url: Optional[str] = Field(None, max_length=500)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    portfolio_url: Optional[str] = Field(None, max_length=500)
    current_company: Optional[str] = Field(None, max_length=200)
    current_title: Optional[str] = Field(None, max_length=200)
    total_experience_years: Optional[str] = Field(None, max_length=20)
    skills: Optional[dict] = None
    source: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    assigned_recruiter_id: Optional[UUID] = None


class CandidateResponse(CandidateBase):
    """Schema for candidate response."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CandidateListResponse(BaseModel):
    """Schema for paginated candidate list."""
    items: list[CandidateResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
