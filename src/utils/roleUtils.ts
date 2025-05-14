
import { UserRole } from '@/types';

// Get the name of a role
export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return 'Utilisateur particulier';
    case 'b2b_user':
    case 'b2b-user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'RH / Manager';
    default:
      return 'Utilisateur';
  }
};

// Get the home path for a given role
export const getRoleHomePath = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
    case 'b2b-user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/dashboard';
    default:
      return '/dashboard';
  }
};

// Get the login path for a given role
export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/auth/login?mode=personal';
    case 'b2b_user':
    case 'b2b-user':
    case 'b2b_admin':
    case 'b2b-admin':
      return '/auth/login?mode=professional';
    default:
      return '/auth/login';
  }
};

// Check if a user has access to a specific route based on their role
export const hasRoleAccess = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Export for backward compatibility and for the TS errors mentioned
export const isAdminRole = (role: UserRole): boolean => {
  return role === 'b2b_admin' || role === 'b2b-admin';
};

// Export for backward compatibility
export const isB2BUser = (role: UserRole): boolean => {
  return role === 'b2b_user' || role === 'b2b-user';
};

// Export for backward compatibility
export const isB2C = (role: UserRole): boolean => {
  return role === 'b2c';
};
