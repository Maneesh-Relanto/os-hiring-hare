/**
 * RBAC Module - Frontend
 * 
 * A standalone, pluggable Role-Based Access Control module for React applications
 * 
 * @example
 * ```tsx
 * import { RBACProvider, usePermissions, PermissionGuard } from '@rbac-module/frontend';
 * 
 * function App() {
 *   return (
 *     <RBACProvider>
 *       <MyApp />
 *     </RBACProvider>
 *   );
 * }
 * 
 * function MyComponent() {
 *   const { hasPermission } = usePermissions();
 *   return hasPermission('edit') ? <EditButton /> : null;
 * }
 * ```
 */

// Core exports
export { RBACProvider } from './components/RBACProvider';
export { PermissionsMatrix } from './components/PermissionsMatrix';
export { PermissionGuard } from './components/PermissionGuard';
export { RoleGuard } from './components/RoleGuard';

// Hooks
export { usePermissions } from './hooks/usePermissions';
export { useRBAC } from './hooks/useRBAC';
export { useAuthStore } from './store/authStore';

// Types
export type {
  Role,
  Permission,
  User,
  RolePermissionMap,
  PermissionCheckOptions,
} from './types';

// Utilities
export { hasPermission, hasRole, hasAnyRole, hasAllRoles } from './utils/permissionUtils';
export { RBACConfig } from './config/RBACConfig';

// Version
export const VERSION = '1.0.0';
