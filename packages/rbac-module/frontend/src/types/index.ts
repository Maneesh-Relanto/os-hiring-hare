/**
 * Core RBAC Type Definitions
 */

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  resource?: string;
  action?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles: Role[];
  permissions?: Permission[];
  created_at?: string;
}

export interface RolePermissionMap {
  [roleName: string]: string[]; // role name -> permission names
}

export interface PermissionCheckOptions {
  requireAll?: boolean; // Require all permissions (AND) or any (OR)
  allowAdmin?: boolean; // Automatically allow admins
  customCheck?: (user: User) => boolean; // Custom permission logic
}

export interface RBACContextValue {
  user: User | null;
  roles: Role[];
  permissions: Permission[];
  hasPermission: (permission: string, options?: PermissionCheckOptions) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  isAdmin: boolean;
  loading: boolean;
}

export interface PermissionsMatrixProps {
  roles: string[];
  features: string[];
  permissions: boolean[][];
  editMode?: boolean;
  onPermissionToggle?: (featureIndex: number, roleIndex: number) => void;
  onSave?: (permissions: boolean[][]) => Promise<void>;
  readOnly?: boolean;
}

export interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export interface PermissionGuardProps extends GuardProps {
  permission: string | string[];
  requireAll?: boolean;
}

export interface RoleGuardProps extends GuardProps {
  role: string | string[];
  requireAll?: boolean;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage';
export type ResourceType = 'users' | 'roles' | 'requirements' | 'candidates' | 'settings' | 'reports';
