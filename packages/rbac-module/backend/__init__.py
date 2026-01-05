"""
RBAC Module - Backend

A standalone, pluggable Role-Based Access Control module for FastAPI applications

Example usage:
    from rbac_module.backend.middleware import require_permission
    from rbac_module.backend.models import Role, Permission
    
    @router.get("/resources")
    @require_permission("view_resources")
    async def get_resources(current_user: User = Depends(get_current_user)):
        return resources
"""

__version__ = "1.0.0"
__author__ = "Your Name"
__license__ = "MIT"

from .models import Role, Permission, UserRole, RolePermission
from .middleware import require_permission, require_role, require_any_permission
from .utils import check_user_permission, check_user_role, get_user_permissions

__all__ = [
    "Role",
    "Permission",
    "UserRole",
    "RolePermission",
    "require_permission",
    "require_role",
    "require_any_permission",
    "check_user_permission",
    "check_user_role",
    "get_user_permissions",
]
