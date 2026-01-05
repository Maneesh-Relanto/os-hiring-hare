"""
RBAC Middleware and Decorators

Provides decorators for protecting FastAPI endpoints with permission checks

Example:
    @router.get("/admin")
    @require_role("admin")
    async def admin_endpoint(current_user: User = Depends(get_current_user)):
        return {"message": "Admin access granted"}
    
    @router.post("/resources")
    @require_permission("create_resource")
    async def create_resource(data: dict, current_user: User = Depends(get_current_user)):
        return resource
"""

from functools import wraps
from typing import List, Callable
from fastapi import HTTPException, status
from .utils import check_user_permission, check_user_role


def require_permission(permission: str):
    """
    Decorator to require a specific permission for an endpoint
    
    Args:
        permission: Permission name required (e.g., "create_resource")
    
    Example:
        @router.post("/resources")
        @require_permission("create_resource")
        async def create_resource(current_user: User = Depends(get_current_user)):
            return resource
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract current_user from kwargs
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not check_user_permission(current_user, permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {permission} required"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def require_role(role: str):
    """
    Decorator to require a specific role for an endpoint
    
    Args:
        role: Role name required (e.g., "admin")
    
    Example:
        @router.get("/admin")
        @require_role("admin")
        async def admin_panel(current_user: User = Depends(get_current_user)):
            return admin_data
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not check_user_role(current_user, role):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role required: {role}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def require_any_permission(permissions: List[str]):
    """
    Decorator to require ANY of the specified permissions (OR logic)
    
    Args:
        permissions: List of permission names (user needs at least one)
    
    Example:
        @router.put("/resources/{id}")
        @require_any_permission(["edit_resource", "approve_resource"])
        async def update_resource(id: str, current_user: User = Depends(get_current_user)):
            return updated_resource
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            has_permission = any(
                check_user_permission(current_user, perm) 
                for perm in permissions
            )
            
            if not has_permission:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"One of these permissions required: {', '.join(permissions)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def require_all_permissions(permissions: List[str]):
    """
    Decorator to require ALL of the specified permissions (AND logic)
    
    Args:
        permissions: List of permission names (user needs all of them)
    
    Example:
        @router.delete("/critical")
        @require_all_permissions(["delete_resource", "admin_access"])
        async def delete_critical(current_user: User = Depends(get_current_user)):
            return {"deleted": True}
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            has_all = all(
                check_user_permission(current_user, perm) 
                for perm in permissions
            )
            
            if not has_all:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"All of these permissions required: {', '.join(permissions)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator
