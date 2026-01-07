"""
Users API endpoints
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.core.security import get_password_hash
from app.models.user import User
from app.models.role import Role, user_roles
from app.schemas.user import UserResponse, UserCreate, UserUpdate


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


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    role_ids: Optional[List[UUID]] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """
    Create a new user (admin only)
    
    - **user_data**: User information including password
    - **role_ids**: Optional list of role IDs to assign
    """
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    result = await db.execute(
        select(User).where(User.username == user_data.username)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        employee_id=user_data.employee_id,
        job_title=user_data.job_title,
        department_id=user_data.department_id,
        password_hash=get_password_hash(user_data.password),
        is_active=True,
        email_verified=False
    )
    
    db.add(user)
    await db.flush()
    
    # Assign roles if provided
    if role_ids:
        for role_id in role_ids:
            # Verify role exists
            role_result = await db.execute(
                select(Role).where(Role.id == role_id)
            )
            role = role_result.scalar_one_or_none()
            if role:
                user.roles.append(role)
    
    await db.commit()
    await db.refresh(user)
    
    # Load roles for response
    await db.execute(
        select(User)
        .options(selectinload(User.roles))
        .where(User.id == user.id)
    )
    
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: UUID,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """
    Update user information (admin only)
    """
    result = await db.execute(
        select(User)
        .options(selectinload(User.roles))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields if provided
    if user_data.email is not None:
        # Check email uniqueness
        result = await db.execute(
            select(User).where(User.email == user_data.email, User.id != user_id)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        user.email = user_data.email
    
    if user_data.first_name is not None:
        user.first_name = user_data.first_name
    if user_data.last_name is not None:
        user.last_name = user_data.last_name
    if user_data.phone is not None:
        user.phone = user_data.phone
    if user_data.employee_id is not None:
        user.employee_id = user_data.employee_id
    if user_data.job_title is not None:
        user.job_title = user_data.job_title
    if user_data.department_id is not None:
        user.department_id = user_data.department_id
    if user_data.manager_id is not None:
        user.manager_id = user_data.manager_id
    if user_data.profile_picture_url is not None:
        user.profile_picture_url = user_data.profile_picture_url
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    
    await db.commit()
    await db.refresh(user)
    
    return user


@router.put("/users/{user_id}/roles", response_model=UserResponse)
async def update_user_roles(
    user_id: UUID,
    role_ids: List[UUID],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """
    Update user's roles (admin only)
    
    Replaces all existing roles with the provided list
    """
    result = await db.execute(
        select(User)
        .options(selectinload(User.roles))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove all existing roles
    await db.execute(
        delete(user_roles).where(user_roles.c.user_id == user_id)
    )
    
    # Add new roles
    for role_id in role_ids:
        role_result = await db.execute(
            select(Role).where(Role.id == role_id)
        )
        role = role_result.scalar_one_or_none()
        if not role:
            raise HTTPException(
                status_code=404,
                detail=f"Role with ID {role_id} not found"
            )
        user.roles.append(role)
    
    await db.commit()
    await db.refresh(user)
    
    # Reload with roles
    result = await db.execute(
        select(User)
        .options(selectinload(User.roles))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """
    Delete a user (admin only)
    
    This is a hard delete. Consider soft delete for production.
    """
    if str(user_id) == str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.delete(user)
    await db.commit()
    
    return None


@router.get("/roles", response_model=List[dict])
async def list_roles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of all available roles
    """
    result = await db.execute(select(Role))
    roles = result.scalars().all()
    
    return [
        {
            "id": str(role.id),
            "name": role.name,
            "display_name": role.display_name,
            "description": role.description
        }
        for role in roles
    ]
