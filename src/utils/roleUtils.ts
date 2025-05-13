
import { UserRole } from '@/types/user';

/**
 * Check if a role is an admin role
 * @param role User role to check
 * @returns Boolean indicating if the role has admin privileges
 */
export function isAdminRole(role: UserRole): boolean {
  return ['admin', 'b2b_admin', 'moderator'].includes(role);
}

/**
 * Check if a role is a business-to-business role (B2B)
 * @param role User role to check
 * @returns Boolean indicating if the role is B2B
 */
export function isB2BRole(role: UserRole): boolean {
  return role === 'b2b_user' || role === 'b2b_admin';
}

/**
 * Check if a role is a business-to-consumer role (B2C)
 * @param role User role to check
 * @returns Boolean indicating if the role is B2C
 */
export function isB2CRole(role: UserRole): boolean {
  return role === 'b2c' || role === 'user';
}
