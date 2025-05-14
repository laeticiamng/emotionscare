
import { UserRole } from '@/types/user';

/**
 * Checks if a user can access a specific route based on their role
 */
export const canAccessRoute = (userRole: UserRole, requiredRole?: UserRole | UserRole[]): boolean => {
  // If no role is required, allow access
  if (!requiredRole) return true;
  
  // Admin roles can access everything
  if (userRole === 'admin' || userRole === 'b2b_admin') return true;
  
  // Check against an array of allowed roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  // Check against a single required role
  return userRole === requiredRole;
};

/**
 * Checks if a user has access to a specific role
 */
export const hasRoleAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Admin roles can access everything
  if (userRole === 'admin' || userRole === 'b2b_admin') return true;
  
  // Direct role match
  if (userRole === requiredRole) return true;
  
  // Handle special role relationships
  if (requiredRole === 'moderator' && (userRole === 'admin' || userRole === 'b2b_admin')) {
    return true;
  }
  
  return false;
};

/**
 * Checks if a role is an admin role
 */
export const isAdminRole = (role: UserRole): boolean => {
  return role === 'admin' || role === 'b2b_admin' || role === 'wellbeing_manager';
};

/**
 * Returns the appropriate redirect URL based on user role
 */
export const getRedirectForRole = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'moderator':
      return '/admin/moderation';
    default:
      return '/dashboard';
  }
};

/**
 * Gets the login path for a specific role
 */
export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'admin':
      return '/admin/login';
    default:
      return '/login';
  }
};

/**
 * Gets the home path for a specific role
 */
export const getRoleHomePath = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

/**
 * Gets the name for a given role
 */
export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
      return 'Utilisateur';
    case 'manager':
      return 'Manager';
    case 'wellbeing_manager':
      return 'Responsable bien-être';
    case 'coach':
      return 'Coach';
    case 'employee':
      return 'Employé';
    case 'moderator':
      return 'Modérateur';
    default:
      return 'Utilisateur';
  }
};

/**
 * Validates if a string is a valid UserRole
 */
export const isValidRole = (role: string): role is UserRole => {
  return ['user', 'admin', 'manager', 'wellbeing_manager', 'coach', 'employee', 'b2c', 'b2b_user', 'b2b_admin', 'moderator'].includes(role as UserRole);
};
