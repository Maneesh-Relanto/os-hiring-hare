# Integration Guide

## How to Integrate RBAC Module into Your Project

### Prerequisites

- **Frontend**: React 18+, TypeScript
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy
- **Database**: PostgreSQL (or any SQLAlchemy-supported DB)

---

## Step 1: Copy the Module

```bash
# From your project root
cp -r packages/rbac-module ./your-project/
```

---

## Step 2: Frontend Integration

### 2.1 Install Dependencies

```bash
cd your-project/frontend
npm install zustand @tanstack/react-query
```

### 2.2 Setup Auth Store

Create or update your auth store to use the RBAC module:

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  roles: Array<{ id: string; name: string; display_name: string }>;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      setAuth: (token, user) => set({ token, user }),
      
      clearAuth: () => set({ token: null, user: null }),
      
      hasRole: (roleName: string) => {
        const user = get().user;
        if (!user) return false;
        return user.roles.some(role => role.name === roleName);
      },
      
      hasAnyRole: (roleNames: string[]) => {
        const user = get().user;
        if (!user) return false;
        return user.roles.some(role => roleNames.includes(role.name));
      },
    }),
    { name: 'auth-storage' }
  )
);
```

### 2.3 Import RBAC Components

```typescript
// Copy the RBAC components to your project
cp -r rbac-module/frontend/src/components/* your-project/src/components/rbac/
cp -r rbac-module/frontend/src/hooks/* your-project/src/hooks/
```

### 2.4 Use in Your App

```tsx
// App.tsx
import { PermissionGuard } from './components/rbac/PermissionGuard';
import { usePermissions } from './hooks/usePermissions';

function MyComponent() {
  const { hasPermission, hasRole } = usePermissions();
  
  return (
    <div>
      {hasRole('admin') && <AdminPanel />}
      
      <PermissionGuard permission="edit_requirements">
        <EditButton />
      </PermissionGuard>
    </div>
  );
}
```

### 2.5 Add Permissions Matrix

```tsx
// Settings page
import { PermissionsMatrix } from './components/rbac/PermissionsMatrix';

function SettingsPage() {
  return (
    <PermissionsMatrix
      roles={roles}
      features={features}
      permissions={permissions}
      onSave={handleSave}
    />
  );
}
```

---

## Step 3: Backend Integration

### 3.1 Install Dependencies

```bash
cd your-project/backend
pip install sqlalchemy fastapi python-jose[cryptography]
```

### 3.2 Copy Backend Models

```bash
cp -r rbac-module/backend/* your-project/backend/app/rbac/
```

### 3.3 Add RBAC Models to Your Database

```python
# app/models/__init__.py
from app.rbac.models import Role, Permission, UserRole, RolePermission
```

### 3.4 Create Database Migration

```bash
alembic revision --autogenerate -m "Add RBAC tables"
alembic upgrade head
```

### 3.5 Protect Your Endpoints

```python
# app/api/v1/endpoints/resources.py
from app.rbac.middleware import require_permission

@router.get("/resources")
@require_permission("view_resources")
async def get_resources(current_user: User = Depends(get_current_user)):
    return resources

@router.post("/resources")
@require_permission("create_resource")
async def create_resource(
    data: ResourceCreate,
    current_user: User = Depends(get_current_user)
):
    return created_resource
```

### 3.6 Seed Initial Roles and Permissions

```python
# app/scripts/seed_rbac.py
from app.rbac.models import Role, Permission, RolePermission

async def seed_rbac():
    # Create roles
    admin_role = Role(name="admin", display_name="Administrator")
    manager_role = Role(name="manager", display_name="Manager")
    
    # Create permissions
    view_perm = Permission(name="view_resources", display_name="View Resources")
    create_perm = Permission(name="create_resource", display_name="Create Resource")
    
    # Assign permissions to roles
    admin_role.permissions.extend([view_perm, create_perm])
    manager_role.permissions.append(view_perm)
    
    db.add_all([admin_role, manager_role, view_perm, create_perm])
    await db.commit()
```

---

## Step 4: Configuration

### 4.1 Define Your Permissions

```python
# config/rbac_config.py
PERMISSIONS = {
    # Resource permissions
    "view_resources": "View resources",
    "create_resource": "Create new resources",
    "edit_resource": "Edit existing resources",
    "delete_resource": "Delete resources",
    
    # Admin permissions
    "manage_users": "Manage users",
    "manage_roles": "Manage roles and permissions",
    
    # Feature permissions
    "approve_items": "Approve items",
    "export_data": "Export data",
}

ROLES = {
    "admin": {
        "display_name": "Administrator",
        "permissions": ["*"],  # All permissions
    },
    "manager": {
        "display_name": "Manager",
        "permissions": [
            "view_resources",
            "create_resource",
            "edit_resource",
            "export_data",
        ],
    },
    "user": {
        "display_name": "User",
        "permissions": [
            "view_resources",
            "create_resource",
        ],
    },
    "viewer": {
        "display_name": "Viewer",
        "permissions": ["view_resources"],
    },
}
```

### 4.2 Frontend Permission Config

```typescript
// config/permissions.ts
export const PERMISSIONS = {
  VIEW_RESOURCES: 'view_resources',
  CREATE_RESOURCE: 'create_resource',
  EDIT_RESOURCE: 'edit_resource',
  DELETE_RESOURCE: 'delete_resource',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
} as const;
```

---

## Step 5: Testing

### 5.1 Test Permission Checks

```typescript
// test/permissions.test.ts
import { hasPermission } from './utils/permissionUtils';

describe('Permission Checks', () => {
  it('admin has all permissions', () => {
    const admin = { roles: [{ name: 'admin' }] };
    expect(hasPermission(admin, 'any_permission')).toBe(true);
  });
  
  it('user with permission can access', () => {
    const user = { 
      roles: [{ 
        name: 'user',
        permissions: [{ name: 'view_resources' }]
      }] 
    };
    expect(hasPermission(user, 'view_resources')).toBe(true);
  });
});
```

### 5.2 Test Backend Decorators

```python
# tests/test_rbac.py
import pytest
from app.rbac.utils import check_user_permission

def test_admin_has_all_permissions():
    admin = User(roles=[Role(name="admin")])
    assert check_user_permission(admin, "any_permission") == True

def test_user_with_permission():
    perm = Permission(name="view_resources")
    role = Role(name="user", permissions=[perm])
    user = User(roles=[role])
    assert check_user_permission(user, "view_resources") == True
```

---

## Step 6: Advanced Features

### 6.1 Resource-Level Permissions

```python
from app.rbac.utils import has_resource_access

def can_edit_resource(user, resource):
    # Owner can always edit
    if resource.owner_id == user.id:
        return True
    
    # Or check permission
    return check_user_permission(user, "edit_any_resource")
```

### 6.2 Custom Permission Logic

```typescript
function useCustomPermissions() {
  const { hasPermission, user } = usePermissions();
  
  const canEditResource = (resource) => {
    // Owner can always edit
    if (resource.ownerId === user.id) return true;
    
    // Or check permission
    return hasPermission('edit_any_resource');
  };
  
  return { canEditResource };
}
```

---

## Common Patterns

### Pattern 1: Menu Filtering

```tsx
const menuItems = [
  { path: '/dashboard', label: 'Dashboard', permission: null },
  { path: '/resources', label: 'Resources', permission: 'view_resources' },
  { path: '/admin', label: 'Admin', role: 'admin' },
];

function Navigation() {
  const { hasPermission, hasRole } = usePermissions();
  
  return (
    <nav>
      {menuItems.map(item => {
        if (item.permission && !hasPermission(item.permission)) return null;
        if (item.role && !hasRole(item.role)) return null;
        return <NavLink to={item.path}>{item.label}</NavLink>;
      })}
    </nav>
  );
}
```

### Pattern 2: Conditional UI

```tsx
function ResourceCard({ resource }) {
  const { hasPermission } = usePermissions();
  
  return (
    <Card>
      <h3>{resource.name}</h3>
      <div>
        {hasPermission('edit_resource') && <EditButton />}
        {hasPermission('delete_resource') && <DeleteButton />}
      </div>
    </Card>
  );
}
```

### Pattern 3: Route Protection

```tsx
import { Navigate } from 'react-router-dom';
import { PermissionGuard } from './components/rbac';

function ProtectedRoute({ children, permission }) {
  return (
    <PermissionGuard 
      permission={permission}
      fallback={<Navigate to="/access-denied" />}
    >
      {children}
    </PermissionGuard>
  );
}
```

---

## Troubleshooting

### Issue: Permissions not updating after login

**Solution**: Ensure you're fetching user data with roles/permissions and storing in state:

```typescript
const loginUser = async (credentials) => {
  const { token } = await api.login(credentials);
  const user = await api.getCurrentUser(); // Must include roles
  setAuth(token, user);
};
```

### Issue: Backend returns 403 Forbidden

**Check**:
1. User has the required role/permission in database
2. Permission decorator is correctly applied
3. `current_user` is properly injected by FastAPI Depends

### Issue: Frontend permission checks fail

**Check**:
1. User object has `roles` array
2. Roles have `name` property
3. Auth store is properly persisted

---

## Next Steps

1. ✅ Customize roles and permissions for your use case
2. ✅ Add UI for role management
3. ✅ Implement audit logging for permission changes
4. ✅ Add role hierarchy (admin > manager > user)
5. ✅ Add permission caching for better performance

For more examples, see the `/examples` directory.
