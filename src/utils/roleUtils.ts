
import { UserRole } from '@/types/types';

/**
 * Check if the provided role is an admin role
 */
export const isAdminRole = (role: UserRole | string): boolean => {
  return role === 'b2b_admin' || role === 'b2b-admin';
};

/**
 * Get user-friendly name for a role
 */
export const getRoleName = (role: UserRole | string): string => {
  switch (role) {
    case 'b2c':
      return 'Utilisateur Personnel';
    case 'b2b_user':
    case 'b2b-user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'Administrateur';
    case 'personal':
      return 'Profil Personnel';
    case 'team':
      return 'Membre d\'équipe';
    case 'b2b-collaborator':
      return 'Collaborateur';
    default:
      return 'Utilisateur';
  }
};

/**
 * Check if a user has access based on the required role
 */
export const hasRoleAccess = (userRole: UserRole | string | undefined, requiredRole: string): boolean => {
  if (!userRole) return false;
  
  // Admin users have access to everything
  if (isAdminRole(userRole)) return true;
  
  // Simple case: exact role match
  if (userRole === requiredRole) return true;
  
  // Handle normalized role formats (b2b_user vs b2b-user)
  const normalizedUserRole = userRole.replace('_', '-');
  const normalizedRequiredRole = requiredRole.replace('_', '-');
  
  return normalizedUserRole === normalizedRequiredRole;
};

/**
 * Check if user has any of the allowed roles
 */
export const hasAnyRole = (role: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(role);
};

/**
 * Get the login path for a specific role
 */
export const getRoleLoginPath = (role: string): string => {
  switch (role) {
    case 'b2b_admin':
    case 'b2b-admin':
      return '/admin/login';
    case 'b2b_user':
    case 'b2b-user':
      return '/login';
    case 'b2b-collaborator':
      return '/login';
    case 'b2c':
      return '/b2c/login';
    default:
      return '/login';
  }
};

/**
 * Get the home path for a specific role
 */
export const getRoleHomePath = (role: string): string => {
  switch (role) {
    case 'b2b_admin':
    case 'b2b-admin':
      return '/admin/dashboard';
    case 'b2b_user':
    case 'b2b-user':
      return '/dashboard';
    case 'b2b-collaborator':
      return '/dashboard';
    case 'b2c':
      return '/b2c/dashboard';
    default:
      return '/dashboard';
  }
};
