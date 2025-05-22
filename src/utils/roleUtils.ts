
import { UserRole } from '@/types/user';
import { normalizeUserMode } from '@/utils/userModeHelpers';

/**
 * Check if a user role is an admin role
 */
export const isAdminRole = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  
  const normalizedRole = normalizeUserMode(role);
  return normalizedRole === 'b2b_admin' || normalizedRole === 'admin';
};

/**
 * Check if a user role is a B2B user role
 */
export const isB2BUserRole = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  
  const normalizedRole = normalizeUserMode(role);
  return normalizedRole === 'b2b_user';
};

/**
 * Check if a user role is a B2C role
 */
export const isB2CRole = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  
  const normalizedRole = normalizeUserMode(role);
  return normalizedRole === 'b2c';
};

/**
 * Get a formatted display name for a user role
 */
export const getRoleDisplayName = (role: UserRole | string | undefined): string => {
  if (!role) return 'Utilisateur';
  
  const normalizedRole = normalizeUserMode(role);
  
  switch (normalizedRole) {
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
 * Check if a user has a specific permission
 * This is a basic implementation - expand as needed
 */
export const hasPermission = (
  role: UserRole | string | undefined,
  permission: string
): boolean => {
  if (!role) return false;
  
  // Admin has all permissions
  if (isAdminRole(role)) return true;
  
  // Example permission structure - expand based on your needs
  const permissionsByRole: Record<string, string[]> = {
    'b2c': ['read:own', 'write:own'],
    'b2b_user': ['read:own', 'write:own', 'read:team'],
    'b2b_admin': ['read:own', 'write:own', 'read:team', 'write:team', 'admin:team'],
    'admin': ['read:all', 'write:all', 'admin:all']
  };
  
  const normalizedRole = normalizeUserMode(role);
  const rolePermissions = permissionsByRole[normalizedRole] || [];
  
  return rolePermissions.includes(permission);
};
