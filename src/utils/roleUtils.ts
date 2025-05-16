
import { UserRole } from '@/types/user';

// Helper function to determine if the user has access based on role hierarchy
export const hasRoleAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Admin has access to all resources
  if (userRole === 'b2b_admin') return true;
  
  // B2B user has access to b2b_user and b2c resources
  if (userRole === 'b2b_user') return requiredRole !== 'b2b_admin';
  
  // B2C users only have access to b2c resources
  return userRole === requiredRole;
};

// Helper function to get the login path based on role
export const getRoleLoginPath = (role: UserRole): string => {
  switch(role) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

// Helper function to get the display name for a role
export const getRoleName = (role: UserRole): string => {
  switch(role) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
    default:
      return 'Particulier';
  }
};

// Helper function to get the dashboard path based on role
export const getRoleDashboardPath = (role: UserRole): string => {
  switch(role) {
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
};

// Get the correct route for account creation based on role
export const getRoleRegisterPath = (role: UserRole): string => {
  switch(role) {
    case 'b2b_admin':
      return '/b2b/admin/register';
    case 'b2b_user':
      return '/b2b/user/register';
    case 'b2c':
    default:
      return '/b2c/register';
  }
};
