
import { User } from "@/types/user";
import { UserModeType } from '@/types';

/**
 * Check if the provided role is an admin role
 */
export const isAdminRole = (role?: string): boolean => {
  if (!role) return false;
  return ['admin', 'administrator', 'b2b_admin'].includes(role.toLowerCase());
};

/**
 * Check if the provided role is a user/employee role
 */
export const isUserRole = (role?: string): boolean => {
  if (!role) return false;
  return ['user', 'employee', 'b2b_user'].includes(role.toLowerCase());
};

/**
 * Get display name for a role
 */
export const getRoleName = (role?: string): string => {
  if (!role) return 'Utilisateur';
  
  const roleMap: Record<string, string> = {
    admin: 'Administrateur',
    administrator: 'Administrateur',
    b2b_admin: 'Admin B2B',
    user: 'Utilisateur',
    employee: 'Collaborateur',
    b2b_user: 'Collaborateur B2B',
    b2c: 'Particulier'
  };
  
  return roleMap[role.toLowerCase()] || 'Utilisateur';
};

/**
 * Check if user has access to a specific protected route based on their role
 */
export const hasRoleAccess = (userRole: string | undefined, requiredRole: string): boolean => {
  if (!userRole) return false;
  
  if (requiredRole === 'b2b_admin' && isAdminRole(userRole)) {
    return true;
  }
  
  if (requiredRole === 'b2b_user' && (isUserRole(userRole) || isAdminRole(userRole))) {
    return true;
  }
  
  if (requiredRole === 'b2c' && userRole === 'b2c') {
    return true;
  }
  
  return userRole.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Get login path based on role
 */
export const getRoleLoginPath = (role: string): string => {
  if (isAdminRole(role)) {
    return '/b2b/admin/login';
  }
  
  if (isUserRole(role)) {
    return '/b2b/user/login';
  }
  
  return '/b2c/login';
};

/**
 * Normalize role name for consistency
 */
export const normalizeUserRole = (role?: string): string => {
  if (!role) return 'b2c';
  
  if (['admin', 'administrator', 'b2b_admin', 'b2badmin'].includes(role.toLowerCase())) {
    return 'b2b_admin';
  }
  
  if (['user', 'employee', 'b2b_user', 'b2buser'].includes(role.toLowerCase())) {
    return 'b2b_user';
  }
  
  return 'b2c';
};

/**
 * Normalize user mode for consistency
 */
export const normalizeUserMode = (mode?: string | UserModeType): string => {
  if (!mode) return 'b2c';
  
  if (typeof mode === 'object' && mode.mode) {
    return mode.mode;
  }
  
  if (typeof mode === 'string') {
    if (['b2b_admin', 'b2badmin', 'admin'].includes(mode.toLowerCase())) {
      return 'b2b-admin';
    }
    
    if (['b2b_user', 'b2buser', 'user'].includes(mode.toLowerCase())) {
      return 'b2b-user';
    }
  }
  
  return 'b2c';
};

/**
 * Compare roles to determine hierarchy level
 */
export const compareRoles = (roleA?: string, roleB?: string): number => {
  const roles = {
    'b2b_admin': 3,
    'admin': 3,
    'administrator': 3,
    'b2b_user': 2,
    'user': 2,
    'employee': 2,
    'b2c': 1
  };
  
  const valueA = roles[normalizeUserRole(roleA)] || 0;
  const valueB = roles[normalizeUserRole(roleB)] || 0;
  
  return valueA - valueB;
};
