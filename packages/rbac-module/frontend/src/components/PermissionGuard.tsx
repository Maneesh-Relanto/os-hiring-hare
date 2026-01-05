/**
 * PermissionGuard Component
 * 
 * Conditionally renders children based on user permissions
 * 
 * @example
 * ```tsx
 * <PermissionGuard permission="edit_resource">
 *   <EditButton />
 * </PermissionGuard>
 * 
 * <PermissionGuard 
 *   permission={['edit_resource', 'delete_resource']}
 *   requireAll={true}
 *   fallback={<AccessDenied />}
 * >
 *   <AdminPanel />
 * </PermissionGuard>
 * ```
 */

import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { PermissionGuardProps } from '../types';

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  requireAll = false,
  fallback = null,
  redirectTo,
}) => {
  const { hasPermission, hasAnyRole } = usePermissions();

  const permissions = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? permissions.every(p => hasPermission(p))
    : permissions.some(p => hasPermission(p));

  if (!hasAccess) {
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

PermissionGuard.displayName = 'PermissionGuard';
