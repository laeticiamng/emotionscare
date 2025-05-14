
// Role utility functions for navigation and access control

/**
 * Determine if the user has access to a specific role-based section
 * @param userRole Current user role
 * @param requiredRole Required role to access a feature/page
 * @returns boolean indicating if the user has access
 */
export function hasRoleAccess(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  
  // Special case for admin roles - they have access to everything
  if (userRole === 'b2b_admin' || userRole === 'super_admin') return true;
  
  // Direct role matching
  if (userRole === requiredRole) return true;
  
  // B2B user can access B2C content but not vice versa
  if (requiredRole === 'b2c' && userRole === 'b2b_user') return true;
  
  return false;
}

/**
 * Get the home path for a specific user role
 * @param role User role
 * @returns Path to redirect to based on role
 */
export function getRoleHomePath(role: string | undefined): string {
  switch(role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/';
  }
}

/**
 * Get the login path for a specific user role
 * @param role User role
 * @returns Path to the login page for the role
 */
export function getRoleLoginPath(role: string | undefined): string {
  switch(role) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/';
  }
}

/**
 * Check if the provided role is an admin role
 * @param role User role
 * @returns boolean indicating if the role has admin privileges
 */
export function isAdminRole(role: string | undefined): boolean {
  return role === 'b2b_admin' || role === 'super_admin';
}

/**
 * Get the appropriate navigation items based on user role
 * @param role User role
 * @returns Array of allowed navigation paths for the role
 */
export function getRoleNavigationPaths(role: string | undefined): string[] {
  switch(role) {
    case 'b2c':
      return ['/b2c/dashboard', '/b2c/journal', '/b2c/music', '/b2c/scan', 
              '/b2c/coach', '/b2c/vr', '/b2c/gamification', '/b2c/preferences', '/b2c/cocon'];
    case 'b2b_user':
      return ['/b2b/user/dashboard', '/b2b/user/journal', '/b2b/user/music', '/b2b/user/scan', 
              '/b2b/user/coach', '/b2b/user/vr', '/b2b/user/gamification', '/b2b/user/preferences', '/b2b/user/cocon'];
    case 'b2b_admin':
      return ['/b2b/admin/dashboard', '/b2b/admin/teams', '/b2b/admin/reports', 
              '/b2b/admin/events', '/b2b/admin/settings'];
    default:
      return [];
  }
}
