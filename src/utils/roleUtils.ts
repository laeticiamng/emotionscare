
import { UserRole } from '@/types';

// Check if user has access to a specific role-protected area
export const hasRoleAccess = (userRole: UserRole | undefined, requiredRole: string): boolean => {
  if (!userRole) return false;
  
  // Admin has access to everything
  if (userRole === 'b2b_admin') return true;
  
  // B2B users can access B2B user areas but not admin
  if (userRole === 'b2b_user' && requiredRole === 'b2b_user') return true;
  
  // B2C users can only access B2C areas
  if (userRole === 'b2c' && requiredRole === 'b2c') return true;
  
  return false;
};

// Get the login path for a specific role
export const getRoleLoginPath = (role: string): string => {
  switch (role) {
    case 'b2b_admin':
      return '/admin/login';
    case 'b2b_user':
      return '/b2b/login';
    case 'b2c':
    default:
      return '/login';
  }
};

// Check if a role is an admin role
export const isAdminRole = (role: UserRole | undefined): boolean => {
  return role === 'b2b_admin';
};

// Get display name for a role
export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Utilisateur Professionnel';
    case 'b2c':
    default:
      return 'Utilisateur Personnel';
  }
};
