
import { UserRole } from '@/types/auth';

/**
 * Get the login path for a specific role
 */
export function getRoleLoginPath(role: 'b2c' | 'b2b_user' | 'b2b_admin'): string {
  switch (role) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/login';
  }
}

/**
 * Get the home path for a specific role
 */
export function getRoleHomePath(role: UserRole): string {
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
}

/**
 * Get the display name for a role
 */
export function getRoleName(role: UserRole): string {
  switch (role) {
    case 'b2c':
      return 'Utilisateur particulier';
    case 'b2b_user':
      return 'Utilisateur professionnel';
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
}

/**
 * Check if a user has access to a specific role
 */
export function hasRoleAccess(userRole: UserRole, requiredRole: 'b2c' | 'b2b_user' | 'b2b_admin'): boolean {
  // Convert string role to UserRole type
  const requiredUserRole = requiredRole as UserRole;
  
  // Admin has access to everything
  if (userRole === 'admin') return true;
  
  // Direct role match
  if (userRole === requiredUserRole) return true;
  
  // B2B admin has access to b2b_user
  if (userRole === 'b2b_admin' && requiredUserRole === 'b2b_user') return true;
  
  return false;
}
