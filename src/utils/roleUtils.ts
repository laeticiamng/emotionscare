
import { UserRole } from '@/types/types';

// Get the name of a role
export const getRoleName = (role: string): string => {
  switch (role) {
    case 'b2c':
      return 'Utilisateur particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'RH / Manager';
    default:
      return 'Utilisateur';
  }
};

// Get the home path for a given role
export const getRoleHomePath = (role: string): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/dashboard';
  }
};

// Get the login path for a given role
export const getRoleLoginPath = (role: string): string => {
  switch (role) {
    case 'b2c':
      return '/auth/login?mode=personal';
    case 'b2b_user':
    case 'b2b_admin':
      return '/auth/login?mode=professional';
    default:
      return '/auth/login';
  }
};

// Check if a user has access to a specific route based on their role
export const hasRoleAccess = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Export for backward compatibility and for the TS errors mentioned
export const isAdminRole = (role: string): boolean => {
  return role === 'b2b_admin';
};

// Export for backward compatibility
export const isB2BUser = (role: string): boolean => {
  return role === 'b2b_user';
};

// Export for backward compatibility
export const isB2C = (role: string): boolean => {
  return role === 'b2c';
};
