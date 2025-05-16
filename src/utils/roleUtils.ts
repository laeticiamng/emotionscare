
import { UserRole } from '@/types/user';

/**
 * Check if the given role is an admin role
 */
export function isAdminRole(role?: UserRole | string): boolean {
  return role === 'b2b_admin';
}

/**
 * Check if the given role is a B2B user role
 */
export function isB2BUserRole(role?: UserRole | string): boolean {
  return role === 'b2b_user';
}

/**
 * Check if the given role is a B2C user role
 */
export function isB2CUserRole(role?: UserRole | string): boolean {
  return role === 'b2c';
}

/**
 * Compare two roles to determine access level
 * @returns true if role1 has equal or higher privileges than role2
 */
export function compareRoles(role1: UserRole | string, role2: UserRole | string): boolean {
  const roleHierarchy: Record<string, number> = {
    'b2b_admin': 3,
    'b2b_user': 2,
    'b2c': 1,
    'guest': 0
  };

  return (roleHierarchy[role1] || 0) >= (roleHierarchy[role2] || 0);
}

/**
 * Normalize user role to ensure it matches expected UserRole type
 */
export function normalizeUserRole(role?: string): UserRole {
  if (role === 'b2b_admin' || role === 'b2b_user' || role === 'b2c') {
    return role as UserRole;
  }
  return 'guest' as UserRole;
}
