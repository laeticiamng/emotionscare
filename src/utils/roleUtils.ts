
import { UserRole } from '@/types/user';

// Function to check if a user role has access to a protected resource
export const hasRoleAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Admin role has access to everything
  if (userRole === 'admin') {
    return true;
  }

  // B2B admin has access to B2B admin and B2B user resources
  if (userRole === 'b2b_admin' || userRole === 'b2b-admin') {
    return requiredRole === 'b2b_admin' || requiredRole === 'b2b_user' || 
           requiredRole === 'b2b-admin' || requiredRole === 'b2b-user';
  }

  // B2B user has access only to B2B user resources
  if (userRole === 'b2b_user' || userRole === 'b2b-user') {
    return requiredRole === 'b2b_user' || requiredRole === 'b2b-user';
  }

  // B2C user has access only to B2C resources
  if (userRole === 'b2c' || userRole === 'user') {
    return requiredRole === 'b2c' || requiredRole === 'user';
  }

  // Direct role match
  return userRole === requiredRole;
};

// Function to get the login path for different roles
export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/login';
    case 'b2b_user':
    case 'b2b-user':
    case 'collaborator':
      return '/b2b/user/login';
    case 'b2c':
    case 'user':
    case 'individual':
    default:
      return '/b2c/login';
  }
};

// Function to get the home route for a specific role
export const getRoleHomeRoute = (role: UserRole): string => {
  switch (role) {
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
    case 'b2b-user':
    case 'collaborator':
      return '/b2b/user/dashboard';
    case 'b2c':
    case 'user':
    case 'individual':
    default:
      return '/b2c/dashboard';
  }
};
