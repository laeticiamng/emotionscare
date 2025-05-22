
import { UserRole } from '@/types/user';
import { UserModeType } from '@/types/userMode';

/**
 * Check if a user role is an admin role
 */
export const isAdminRole = (role?: UserRole | string | null): boolean => {
  if (!role) return false;
  return role.includes('admin') || role === 'b2b_admin' || role === 'b2b-admin';
};

/**
 * Check if a user role is a B2B user role (collaborator)
 */
export const isB2BUserRole = (role?: UserRole | string | null): boolean => {
  if (!role) return false;
  return (role.includes('b2b') && !isAdminRole(role)) || 
         role === 'b2b_user' || 
         role === 'b2b-user' ||
         role === 'collaborateur';
};

/**
 * Convert user role to mode type
 */
export const roleToMode = (role?: UserRole | string | null): UserModeType => {
  if (!role) return 'b2c';
  
  if (isAdminRole(role)) {
    return 'b2b_admin';
  }
  
  if (isB2BUserRole(role)) {
    return 'b2b_user';
  }
  
  return 'b2c';
};

/**
 * Get display name for a role
 */
export const getRoleDisplayName = (role?: UserRole | string | null): string => {
  if (!role) return 'Particulier';
  
  if (isAdminRole(role)) {
    return 'Administrateur';
  }
  
  if (isB2BUserRole(role)) {
    return 'Collaborateur';
  }
  
  return 'Particulier';
};
