
import { UserRole } from '@/types/user';

/**
 * Check if a role is considered an admin role
 */
export const isAdminRole = (role?: UserRole | string): boolean => {
  if (!role) return false;
  
  const normalizedRole = role.toLowerCase();
  return normalizedRole === 'b2b_admin' || normalizedRole === 'admin';
};

/**
 * Check if a role is considered a B2B role
 */
export const isB2BRole = (role?: UserRole | string): boolean => {
  if (!role) return false;
  
  const normalizedRole = role.toLowerCase();
  return normalizedRole === 'b2b_user' || normalizedRole === 'b2b_admin';
};

/**
 * Check if a role is a B2C role
 */
export const isB2CRole = (role?: UserRole | string): boolean => {
  if (!role) return false;
  
  const normalizedRole = role.toLowerCase();
  return normalizedRole === 'b2c';
};

/**
 * Get a human-readable label for a role
 */
export const getRoleLabel = (role?: UserRole | string): string => {
  if (!role) return 'Utilisateur';
  
  switch (role.toLowerCase()) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    case 'admin':
      return 'Super Admin';
    default:
      return 'Utilisateur';
  }
};

/**
 * Normalize a role string to a valid UserRole type
 */
export const normalizeRole = (role?: string): UserRole => {
  if (!role) return 'b2c';
  
  const normalizedRole = role.toLowerCase();
  
  if (normalizedRole === 'b2b_admin' || normalizedRole === 'admin') {
    return 'b2b_admin';
  } else if (normalizedRole === 'b2b_user' || normalizedRole === 'b2b') {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
};

export default {
  isAdminRole,
  isB2BRole,
  isB2CRole,
  getRoleLabel,
  normalizeRole
};
