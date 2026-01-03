"""
FastAPI dependencies for authentication and authorization
"""
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.services.user_service import UserService

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Get current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer credentials with JWT token
        db: Database session
        
    Returns:
        Current authenticated user
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    
    # Verify token
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check token type
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token
    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    user_service = UserService(db)
    user = await user_service.get_by_id(user_id)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active user (wrapper for consistency)
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current active user
    """
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current superuser (admin only)
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current superuser
        
    Raises:
        HTTPException: If user is not a superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Superuser access required.",
        )
    return current_user


def require_role(role_name: str):
    """
    Dependency factory for requiring specific roles
    
    Usage:
        @router.get("/admin-only")
        async def admin_endpoint(user: User = Depends(require_role("admin"))):
            ...
    
    Args:
        role_name: Name of required role
        
    Returns:
        Dependency function
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        """Check if user has required role"""
        user_roles = [role.name for role in current_user.roles]
        
        if role_name not in user_roles and not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Role '{role_name}' required.",
            )
        
        return current_user
    
    return role_checker
