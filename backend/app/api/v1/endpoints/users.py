"""
Users API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserResponse


router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    role: Optional[str] = Query(None, description="Filter by role name"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of users
    
    - **role**: Filter by role (e.g., 'recruiter', 'approver', 'admin')
    - **is_active**: Filter by active status
    """
    # Build query
    query = select(User).options(selectinload(User.roles))
    
    # Apply filters
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    # Filter by role if specified
    if role:
        query = query.join(User.roles).where(Role.name == role)
    
    # Execute query
    result = await db.execute(query)
    users = result.scalars().unique().all()
    
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific user by ID
    """
    result = await db.execute(
        select(User)
        .options(selectinload(User.roles))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
