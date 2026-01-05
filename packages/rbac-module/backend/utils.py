"""
RBAC Utility Functions

Helper functions for permission checking and role management

Example:
    from rbac_module.backend.utils import check_user_permission, get_user_permissions
    
    if check_user_permission(user, "edit_resource"):
        # Allow edit
        pass
    
    all_perms = get_user_permissions(user)
"""

from typing import List, Optional


def check_user_permission(user, permission: str) -> bool:
    """
    Check if a user has a specific permission through their roles
    
    Args:
        user: User object with roles attribute
        permission: Permission name to check
    
    Returns:
        True if user has the permission, False otherwise
    
    Example:
        if check_user_permission(current_user, "delete_resource"):
            await delete_resource(resource_id)
    """
    if not user or not hasattr(user, 'roles'):
        return False
    
    # Check if user has admin role (admin has all permissions)
    if check_user_role(user, 'admin'):
        return True
    
    # Check each role for the permission
    for role in user.roles:
        if hasattr(role, 'permissions'):
            for perm in role.permissions:
                if perm.name == permission:
                    return True
    
    return False


def check_user_role(user, role_name: str) -> bool:
    """
    Check if a user has a specific role
    
    Args:
        user: User object with roles attribute
        role_name: Role name to check
    
    Returns:
        True if user has the role, False otherwise
    
    Example:
        if check_user_role(current_user, "manager"):
            # Show manager features
            pass
    """
    if not user or not hasattr(user, 'roles'):
        return False
    
    return any(role.name == role_name for role in user.roles)


def check_any_role(user, role_names: List[str]) -> bool:
    """
    Check if a user has ANY of the specified roles
    
    Args:
        user: User object with roles attribute
        role_names: List of role names to check
    
    Returns:
        True if user has at least one of the roles, False otherwise
    """
    if not user or not hasattr(user, 'roles'):
        return False
    
    return any(check_user_role(user, role) for role in role_names)


def check_all_roles(user, role_names: List[str]) -> bool:
    """
    Check if a user has ALL of the specified roles
    
    Args:
        user: User object with roles attribute
        role_names: List of role names to check
    
    Returns:
        True if user has all roles, False otherwise
    """
    if not user or not hasattr(user, 'roles'):
        return False
    
    return all(check_user_role(user, role) for role in role_names)


def get_user_permissions(user) -> List[str]:
    """
    Get all permissions for a user from their roles
    
    Args:
        user: User object with roles attribute
    
    Returns:
        List of permission names
    
    Example:
        permissions = get_user_permissions(current_user)
        print(f"User has {len(permissions)} permissions")
    """
    if not user or not hasattr(user, 'roles'):
        return []
    
    # Admin has all permissions
    if check_user_role(user, 'admin'):
        return ['*']  # Wildcard represents all permissions
    
    permissions = set()
    for role in user.roles:
        if hasattr(role, 'permissions'):
            for perm in role.permissions:
                permissions.add(perm.name)
    
    return list(permissions)


def get_user_roles(user) -> List[str]:
    """
    Get all role names for a user
    
    Args:
        user: User object with roles attribute
    
    Returns:
        List of role names
    """
    if not user or not hasattr(user, 'roles'):
        return []
    
    return [role.name for role in user.roles]


def has_resource_access(user, resource, action: str = 'read') -> bool:
    """
    Check if user has access to a specific resource
    Useful for resource-level permissions (e.g., only owner can edit)
    
    Args:
        user: User object
        resource: Resource object with owner_id attribute
        action: Action to check ('read', 'update', 'delete')
    
    Returns:
        True if user has access, False otherwise
    
    Example:
        if has_resource_access(current_user, document, 'update'):
            # Allow editing
            pass
    """
    # Admin has access to everything
    if check_user_role(user, 'admin'):
        return True
    
    # Owner has full access to their resources
    if hasattr(resource, 'owner_id') and resource.owner_id == user.id:
        return True
    
    # Check permission for the action
    permission_name = f"{action}_{type(resource).__name__.lower()}"
    return check_user_permission(user, permission_name)


def is_admin(user) -> bool:
    """
    Quick check if user is admin
    
    Args:
        user: User object
    
    Returns:
        True if user is admin
    """
    return check_user_role(user, 'admin')
