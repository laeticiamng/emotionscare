
import { UserRole } from '@/types/user';

/**
 * Check if a user role is an admin role
 */
export function isAdminRole(role?: UserRole): boolean {
  return role === 'admin' || role === 'b2b_admin';
}

/**
 * Get the appropriate redirect path based on user role
 */
export function getRedirectPathForRole(role?: UserRole): string {
  if (!role) return '/';
  
  switch (role) {
    case 'admin':
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'user':
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
}

/**
 * Check if a user has access to a specific route based on role
 */
export function userHasRouteAccess(role: UserRole | undefined, routeType: 'b2c' | 'b2b-user' | 'b2b-admin'): boolean {
  if (!role) return false;
  
  switch (routeType) {
    case 'b2c':
      return role === 'user' || role === 'b2c';
    case 'b2b-user':
      return role === 'b2b_user' || isAdminRole(role);
    case 'b2b-admin':
      return isAdminRole(role);
    default:
      return false;
  }
}
