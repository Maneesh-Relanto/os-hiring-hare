# Role-Based Access Control (RBAC) Implementation

## Overview
The Hiring Hare application now includes a complete Role-Based Access Control (RBAC) system that manages user permissions across the platform.

## Built-in Roles

### 1. Super Admin
- **Full system access** with all permissions
- Can manage all aspects of the system
- Assigned permissions: All (29 permissions)

### 2. Administrator
- Administrative access to manage system and users
- Can perform most operations except super admin functions
- **Permissions**: All requirement, candidate, interview, job posting, user, report, and settings operations
- Assigned permissions: 29 permissions

### 3. Hiring Manager
- Creates and manages job requirements for their department
- Can view candidates and interviews
- **Permissions**:
  - requirement.create, requirement.read, requirement.update, requirement.delete, requirement.assign
  - candidate.read
  - interview.read
  - job_posting.read
  - report.read
- Assigned permissions: 9 permissions

### 4. Approver
- Approves or rejects job requirements
- Read-only access to candidates and interviews
- **Permissions**:
  - requirement.read, requirement.approve
  - candidate.read
  - interview.read
  - report.read
- Assigned permissions: 5 permissions

### 5. Recruiter
- Manages candidates and recruitment process
- Creates job postings from approved requirements
- **Permissions**:
  - requirement.read, requirement.update
  - candidate.* (all candidate operations)
  - interview.* (all interview operations)
  - job_posting.* (all job posting operations)
  - report.read
- Assigned permissions: 16 permissions

### 6. Interviewer
- Conducts interviews and provides feedback
- Read-only access to requirements and candidates
- **Permissions**:
  - requirement.read
  - candidate.read
  - interview.read, interview.feedback
  - report.read
- Assigned permissions: 5 permissions

### 7. Viewer
- Read-only access to view requirements and candidates
- Cannot make any changes to the system
- **Permissions**:
  - requirement.read
  - candidate.read
  - interview.read
  - job_posting.read
  - report.read
- Assigned permissions: 5 permissions

## Permissions Structure

Permissions follow the format: `resource.action`

### Resources
- **requirement**: Job requirements
- **candidate**: Candidate profiles
- **interview**: Interview scheduling and feedback
- **job_posting**: Job advertisements
- **user**: User management
- **report**: Analytics and reporting
- **settings**: System configuration

### Actions
- **create**: Create new records
- **read**: View records
- **update**: Modify existing records
- **delete**: Delete records
- **approve**: Approve requirements (special action)
- **assign**: Assign requirements to recruiters (special action)
- **feedback**: Provide interview feedback (special action)
- **publish**: Publish job postings (special action)
- **assign_role**: Assign roles to users (special action)
- **export**: Export reports (special action)

## Test Users

The system includes test users with different roles for testing:

| Email | Password | Role(s) |
|-------|----------|---------|
| admin@hiringhare.com | Admin@2024 | Administrator |
| manager@hiringhare.com | Manager@2024 | Hiring Manager |
| approver@hiringhare.com | Approver@2024 | Approver, Hiring Manager |
| recruiter@hiringhare.com | Recruiter@2024 | Recruiter |
| interviewer@hiringhare.com | Interviewer@2024 | Interviewer |
| viewer@hiringhare.com | Viewer@2024 | Viewer |

## API Endpoint Protection

### Requirements Endpoints
- **GET /api/v1/requirements**: All authenticated users can view
- **POST /api/v1/requirements**: Requires `hiring_manager` role
- **PUT /api/v1/requirements/{id}**: Requires `hiring_manager` role
- **DELETE /api/v1/requirements/{id}**: Requires `hiring_manager` role

More endpoints will be protected as they are implemented (candidates, interviews, etc.)

## Frontend Role Checking

### Navigation Menu
Menu items are shown/hidden based on user roles:
- **Dashboard**: All users
- **Requirements**: admin, hiring_manager, approver, recruiter, viewer
- **Candidates**: admin, recruiter, interviewer, viewer
- **Reports**: All users
- **Settings**: admin only

### Auth Store Utilities
```typescript
// Check if user has a specific role
const hasRole = useAuthStore(state => state.hasRole);
if (hasRole('admin')) {
  // Show admin features
}

// Check if user has any of the specified roles
const hasAnyRole = useAuthStore(state => state.hasAnyRole);
if (hasAnyRole(['admin', 'hiring_manager'])) {
  // Show feature
}
```

### User Interface
- User profile in sidebar shows up to 2 roles as chips
- User menu shows all roles assigned to the user
- Settings menu item only appears for admins

## Backend Implementation

### Using Role Dependencies in Endpoints
```python
from app.core.deps import require_role, get_current_superuser

# Require specific role
@router.post("/endpoint")
async def endpoint(
    current_user: User = Depends(require_role("hiring_manager"))
):
    # Only users with hiring_manager role can access
    pass

# Require superuser
@router.post("/admin-endpoint")
async def admin_endpoint(
    current_user: User = Depends(get_current_superuser)
):
    # Only superusers can access
    pass
```

### Checking Permissions Programmatically
```python
# In user model
user.has_role("admin")  # Returns True/False
user.has_permission("requirement.create")  # Returns True/False
```

## Database Schema

### Tables
- **roles**: Role definitions
- **permissions**: Permission definitions
- **role_permissions**: Many-to-many relationship between roles and permissions
- **user_roles**: Many-to-many relationship between users and roles

### Key Fields
- **roles.is_system_role**: Prevents deletion of built-in roles
- **user_roles.assigned_at**: Tracks when role was assigned
- **user_roles.expires_at**: Optional expiration for temporary role assignments

## Seeding Data

### Seed Roles and Permissions
```bash
cd backend
py -3.13 scripts/seed_roles_permissions.py
```

### Assign Roles to Users
```bash
cd backend
py -3.13 scripts/assign_user_roles.py
```

## Future Enhancements

1. **Dynamic Role Creation**: Allow admins to create custom roles
2. **Fine-grained Permissions**: Add more granular permissions (e.g., "edit own requirements" vs "edit all requirements")
3. **Role Hierarchy**: Implement role inheritance
4. **Audit Logging**: Track permission changes and access attempts
5. **Temporary Roles**: Implement expiring role assignments
6. **Department-scoped Roles**: Limit roles to specific departments
7. **Permission Groups**: Group related permissions for easier management

## Security Considerations

1. **Superuser Bypass**: Users with `is_superuser=True` bypass all permission checks
2. **Token Validation**: All protected endpoints validate JWT tokens
3. **Role Loading**: User roles are eagerly loaded with user data for performance
4. **Permission Caching**: Consider caching user permissions for better performance
5. **Frontend Protection**: Frontend checks are for UX only; backend always enforces permissions

## API Response Structure

### User with Roles
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "roles": [
    {
      "id": "uuid",
      "name": "hiring_manager",
      "display_name": "Hiring Manager",
      "description": "Creates and manages job requirements"
    }
  ]
}
```

### Error Response (Insufficient Permissions)
```json
{
  "detail": "Insufficient permissions. Role 'hiring_manager' required."
}
```
HTTP Status: 403 Forbidden
