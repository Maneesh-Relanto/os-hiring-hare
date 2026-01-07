"""
Approval schemas for API
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.models.approval import ApprovalStatus, ApprovalStage


# Request Schemas
class ApprovalAction(BaseModel):
    """Base schema for approval actions"""
    comments: Optional[str] = Field(None, description="Optional comments from approver")


class ApprovalReject(BaseModel):
    """Schema for rejecting a requirement"""
    comments: str = Field(..., min_length=10, description="Rejection reason (required, min 10 chars)")


# Response Schemas
class ApprovalResponse(BaseModel):
    """Response schema for approval"""
    id: UUID
    requirement_id: UUID
    approver_id: UUID
    approval_stage: ApprovalStage
    status: ApprovalStatus
    comments: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    
    # Approver details
    approver_name: Optional[str] = None
    approver_email: Optional[str] = None
    
    class Config:
        from_attributes = True


class ApprovalListResponse(BaseModel):
    """Response schema for list of approvals"""
    approvals: list[ApprovalResponse]
    total: int
