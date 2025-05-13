
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

/**
 * Get a human-readable name for a role
 * @param role User role
 * @returns Display name for the role
 */
export function getRoleName(role: UserRole): string {
  switch (role) {
    case 'b2c': return 'Particulier';
    case 'b2b_admin': return 'Administrateur';
    case 'b2b_user': return 'Collaborateur';
    case 'admin': return 'Super Administrateur';
    case 'moderator': return 'Modérateur';
    default: return 'Utilisateur';
  }
}
