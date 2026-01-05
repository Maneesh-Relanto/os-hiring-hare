# RBAC Module

A standalone, pluggable Role-Based Access Control (RBAC) module for web applications.

## Features

- 🔐 **Role-based permissions** - Define roles and their access levels
- 🎯 **Permission checks** - Easy-to-use hooks and guards
- 📊 **Visual permission matrix** - Interactive UI for managing permissions
- 🔄 **Framework agnostic** - Works with React/FastAPI but adaptable
- 📦 **Self-contained** - All RBAC logic in one module

## Structure

```
rbac-module/
├── frontend/          # React components, hooks, and utilities
│   ├── components/    # PermissionsMatrix, RoleGuard, etc.
│   ├── hooks/         # usePermissions, useRole hooks
│   ├── store/         # Auth state management
│   └── types/         # TypeScript interfaces
├── backend/           # FastAPI models, middleware, utilities
│   ├── models/        # Role, Permission database models
│   ├── middleware/    # Permission checking middleware
│   ├── schemas/       # Pydantic schemas
│   └── utils/         # Permission helpers
└── docs/             # Integration guides
```

## Quick Start

### Frontend Integration (React)

```typescript
import { RBACProvider, usePermissions, PermissionsMatrix } from '@/rbac-module/frontend';

// 1. Wrap your app with RBACProvider
function App() {
  return (
    <RBACProvider>
      <YourApp />
    </RBACProvider>
  );
}

// 2. Check permissions in components
function MyComponent() {
  const { hasPermission, hasRole } = usePermissions();
  
  if (!hasPermission('view_requirements')) {
    return <AccessDenied />;
  }
  
  return <div>Your content</div>;
}

// 3. Use permission guards
import { PermissionGuard } from '@/rbac-module/frontend';

<PermissionGuard permission="edit_requirements">
  <EditButton />
</PermissionGuard>
```

### Backend Integration (FastAPI)

```python
from rbac_module.backend.middleware import require_permission
from rbac_module.backend.models import Role, Permission

# Protect endpoints with permissions
@router.get("/requirements")
@require_permission("view_requirements")
async def get_requirements(current_user: User = Depends(get_current_user)):
    return requirements

# Check permissions programmatically
from rbac_module.backend.utils import check_user_permission

if check_user_permission(user, "delete_requirements"):
    # Allow deletion
    pass
```

## Configuration

### Define Your Roles and Permissions

```typescript
// frontend/config/rbac-config.ts
export const ROLES = [
  'admin',
  'manager',
  'approver',
  'user',
  'viewer'
];

export const PERMISSIONS = {
  'view_dashboard': ['admin', 'manager', 'user', 'viewer'],
  'create_resource': ['admin', 'manager'],
  'edit_resource': ['admin', 'manager'],
  'delete_resource': ['admin'],
  'approve_resource': ['admin', 'approver'],
  'manage_users': ['admin'],
  'manage_roles': ['admin'],
};
```

```python
# backend/config/rbac_config.py
ROLES = [
    {"name": "admin", "display_name": "Administrator", "description": "Full system access"},
    {"name": "manager", "display_name": "Manager", "description": "Manage resources"},
    {"name": "approver", "display_name": "Approver", "description": "Approve actions"},
    {"name": "user", "display_name": "User", "description": "Basic access"},
    {"name": "viewer", "display_name": "Viewer", "description": "Read-only access"},
]

PERMISSIONS = [
    {"name": "view_dashboard", "description": "View dashboard"},
    {"name": "create_resource", "description": "Create resources"},
    {"name": "edit_resource", "description": "Edit resources"},
    {"name": "delete_resource", "description": "Delete resources"},
    {"name": "approve_resource", "description": "Approve resources"},
    {"name": "manage_users", "description": "Manage users"},
    {"name": "manage_roles", "description": "Manage roles"},
]

ROLE_PERMISSIONS = {
    "admin": ["*"],  # All permissions
    "manager": ["view_dashboard", "create_resource", "edit_resource"],
    "approver": ["view_dashboard", "approve_resource"],
    "user": ["view_dashboard"],
    "viewer": ["view_dashboard"],
}
```

## Components

### PermissionsMatrix

Interactive permission management UI with inline editing:

```tsx
import { PermissionsMatrix } from '@/rbac-module/frontend/components';

<PermissionsMatrix
  roles={roles}
  permissions={permissions}
  rolePermissions={rolePermissions}
  onSave={handleSavePermissions}
/>
```

### RoleGuard / PermissionGuard

Conditional rendering based on roles/permissions:

```tsx
import { RoleGuard, PermissionGuard } from '@/rbac-module/frontend/components';

<RoleGuard roles={['admin', 'manager']}>
  <AdminPanel />
</RoleGuard>

<PermissionGuard permission="edit_resource">
  <EditButton />
</PermissionGuard>
```

## API Reference

### Frontend Hooks

#### `usePermissions()`
```typescript
const {
  hasPermission,    // (permission: string) => boolean
  hasRole,          // (role: string) => boolean
  hasAnyRole,       // (roles: string[]) => boolean
  hasAllRoles,      // (roles: string[]) => boolean
  user,             // Current user object
  roles,            // User's roles
  permissions,      // User's permissions
} = usePermissions();
```

#### `useRBAC()`
```typescript
const {
  checkPermission,      // Check if user has permission
  getUserRoles,         // Get user's roles
  isAdmin,              // Check if user is admin
  canAccess,            // Check route access
} = useRBAC();
```

### Backend Utilities

#### Permission Decorators
```python
@require_permission("view_resource")
@require_role("admin")
@require_any_permission(["edit_resource", "approve_resource"])
```

#### Permission Checkers
```python
from rbac_module.backend.utils import (
    check_user_permission,
    check_user_role,
    get_user_permissions,
    get_role_permissions,
)
```

## Database Schema

The module uses these core tables:

- **roles** - Role definitions
- **permissions** - Permission definitions  
- **role_permissions** - Role-Permission mapping
- **user_roles** - User-Role assignment

See `backend/models/` for full schema definitions.

## Migration Guide

### From Existing Project

1. **Copy the rbac-module folder** to your project
2. **Update imports** in your existing code
3. **Configure roles and permissions** in config files
4. **Run database migrations** for RBAC tables
5. **Update authentication** to include role/permission info

### To New Project

1. **Install dependencies**:
   ```bash
   # Frontend
   npm install zustand @tanstack/react-query
   
   # Backend  
   pip install sqlalchemy fastapi
   ```

2. **Copy the module** to your project structure

3. **Import and configure** following the Quick Start guide

## Advanced Usage

### Custom Permission Logic

```typescript
// frontend/hooks/useCustomPermissions.ts
import { usePermissions } from '@/rbac-module/frontend';

export function useCustomPermissions() {
  const { hasPermission, user } = usePermissions();
  
  const canEditResource = (resource: Resource) => {
    // Custom logic: owner can always edit
    if (resource.ownerId === user.id) return true;
    
    // Otherwise check permission
    return hasPermission('edit_resource');
  };
  
  return { canEditResource };
}
```

### Dynamic Permission Loading

```python
# backend/utils/dynamic_permissions.py
async def load_permissions_from_database():
    """Load permissions dynamically from database"""
    permissions = await db.query(Permission).all()
    role_permissions = await db.query(RolePermission).all()
    return build_permission_map(permissions, role_permissions)
```

## Best Practices

1. **Keep permissions granular** - Small, specific permissions are easier to manage
2. **Use role hierarchy** - Admin inherits all lower role permissions
3. **Cache permission checks** - Avoid repeated database queries
4. **Document permissions** - Clear descriptions for each permission
5. **Test thoroughly** - Unit test all permission logic

## Examples

See the `examples/` directory for complete integration examples:
- React + TypeScript app
- FastAPI backend
- Next.js integration
- Express.js integration

## Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

## License

MIT License - See LICENSE file for details.

## Support

- GitHub Issues: [Report bugs](https://github.com/your-org/rbac-module/issues)
- Documentation: [Full docs](https://docs.rbac-module.dev)
- Discord: [Community chat](https://discord.gg/rbac-module)

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: Your Name
