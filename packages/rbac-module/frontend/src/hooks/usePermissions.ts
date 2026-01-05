/**
 * usePermissions Hook
 * 
 * Main hook for checking user permissions and roles
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hasPermission, hasRole, user } = usePermissions();
 *   
 *   if (!hasPermission('edit_resource')) {
 *     return <AccessDenied />;
 *   }
 *   
 *   return <EditButton />;
 * }
 * ```
 */

import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import type { PermissionCheckOptions, RBACContextValue } from '../types';

export function usePermissions(): RBACContextValue {
  const { user } = useAuthStore();

  const roles = useMemo(() => user?.roles || [], [user]);
  const permissions = useMemo(() => {
    // Extract all permissions from user's roles
    const perms: any[] = [];
    roles.forEach(role => {
      // Assuming role has permissions array
      if ((role as any).permissions) {
        perms.push(...(role as any).permissions);
      }
    });
    return perms;
  }, [roles]);

  const hasPermission = (
    permission: string,
    options: PermissionCheckOptions = {}
  ): boolean => {
    if (!user) return false;

    const { allowAdmin = true, customCheck } = options;

    // Custom check takes precedence
    if (customCheck) {
      return customCheck(user);
    }

    // Admin bypass
    if (allowAdmin && hasRole('admin')) {
      return true;
    }

    // Check if user has the permission through any of their roles
    return permissions.some(p => p.name === permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return roles.some(r => r.name === role);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user) return false;
    return roles.some(role => roleNames.includes(role.name));
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    if (!user) return false;
    return roleNames.every(roleName => 
      roles.some(role => role.name === roleName)
    );
  };

  const isAdmin = useMemo(() => hasRole('admin'), [roles]);

  return {
    user,
    roles,
    permissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    loading: false,
  };
}
