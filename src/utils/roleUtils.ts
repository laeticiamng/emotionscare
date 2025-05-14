
import { UserRole } from '@/types/types';

/**
 * Check if a user role is an admin role
 */
export const isAdminRole = (role: string): boolean => {
  return role === 'b2b_admin' || role === 'admin';
};

/**
 * Get the display name for a user role
 */
export const getRoleName = (role: string): string => {
  switch (role) {
    case 'b2c': return 'Utilisateur particulier';
    case 'b2b_user': return 'Collaborateur';
    case 'b2b_admin': return 'RH / Manager';
    default: return 'Utilisateur';
  }
};

/**
 * Check if a role has specific permissions
 */
export const hasPermission = (role: UserRole, permission: string): boolean => {
  if (role === 'b2b_admin') {
    return true; // Admin has all permissions
  }
  
  // Define permission sets for other roles
  const permissions: Record<UserRole, string[]> = {
    'b2b_admin': ['all'],
    'b2b_user': ['view_own_data', 'edit_own_profile', 'participate_sessions'],
    'b2c': ['view_own_data', 'edit_own_profile', 'participate_sessions']
  };
  
  return permissions[role]?.includes(permission) || false;
};

/**
 * Safe conversion of string to UserRole
 */
export const toUserRole = (role: string): UserRole => {
  if (role === 'b2c' || role === 'b2b_user' || role === 'b2b_admin') {
    return role as UserRole;
  }
  return 'b2c'; // Default fallback
};
