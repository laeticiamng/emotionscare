
import { UserRole } from '@/types';

/**
 * Normalizes a role string to a standard format
 * @param role The role string to normalize
 * @returns Normalized role string
 */
export const normalizeRole = (role?: string): string => {
  if (!role) return 'user';
  
  const lowerRole = role.toLowerCase();
  
  // Map various admin roles to b2b_admin
  if (lowerRole.includes('admin') || lowerRole.includes('manager') || lowerRole === 'hr') {
    return 'b2b_admin';
  }
  
  // Map various user/employee roles to b2b_user
  if (lowerRole.includes('employee') || lowerRole.includes('collaborator') || lowerRole === 'user') {
    return 'b2b_user';
  }
  
  // Return the original role if no mapping found
  return lowerRole;
};

/**
 * Checks if the given role is an admin role
 * @param role The role to check
 * @returns True if the role is an admin role, false otherwise
 */
export const isAdminRole = (role?: string): boolean => {
  if (!role) return false;
  
  const normalizedRole = normalizeRole(role);
  return normalizedRole.includes('admin') || normalizedRole === 'superadmin';
};

/**
 * Checks if the user can access admin features
 * @param role The user's role
 * @returns True if the user has admin access, false otherwise
 */
export const hasAdminAccess = (role?: string): boolean => {
  return isAdminRole(role);
};

/**
 * Gets the display name for a role
 * @param role The role to get a display name for
 * @returns User-friendly display name for the role
 */
export const getRoleDisplayName = (role?: string): string => {
  if (!role) return 'User';
  
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'b2b_admin':
      return 'Administrator';
    case 'b2b_user':
      return 'Employee';
    case 'superadmin':
      return 'Super Administrator';
    case 'b2c':
      return 'Individual User';
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
};

/**
 * Gets the permission level of a role (higher number = more permissions)
 * @param role The role to get a permission level for
 * @returns Numeric permission level (0-10)
 */
export const getRolePermissionLevel = (role?: string): number => {
  if (!role) return 1; // Default user level
  
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'superadmin':
      return 10;
    case 'b2b_admin':
      return 8;
    case 'hr':
      return 7;
    case 'manager':
      return 6;
    case 'b2b_user':
      return 3;
    case 'b2c':
      return 2;
    default:
      return 1;
  }
};
