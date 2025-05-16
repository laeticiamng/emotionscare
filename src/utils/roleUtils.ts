
import { UserRole } from '@/types/user';

/**
 * Compare two roles to determine if role1 is higher than or equal to role2
 */
export function compareRoles(role1: UserRole, role2: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'admin': 100,
    'therapist': 50,
    'user': 10,
    'guest': 0
  };
  
  return roleHierarchy[role1] >= roleHierarchy[role2];
}

/**
 * Get user-friendly name for a role
 */
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    'admin': 'Administrateur',
    'therapist': 'Thérapeute',
    'user': 'Utilisateur',
    'guest': 'Invité'
  };
  
  return roleNames[role] || 'Utilisateur';
}

/**
 * Check if the user has access to specific routes based on their role
 */
export function hasRoleAccess(role: UserRole, requiredRole: UserRole): boolean {
  return compareRoles(role, requiredRole);
}

/**
 * Get login path for a specific role
 */
export function getRoleLoginPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/b2b/admin/login';
    case 'therapist':
      return '/b2b/therapist/login';
    default:
      return '/b2c/login';
  }
}

/**
 * Get dashboard path for a specific role
 */
export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/b2b/admin/dashboard';
    case 'therapist':
      return '/b2b/therapist/dashboard';
    default:
      return '/dashboard';
  }
}
