
/**
 * Utility functions for role-based checks
 */

/**
 * Check if a user has admin or direction privileges
 * @param role The user's role
 * @returns boolean indicating if the user has admin privileges
 */
export const isAdminRole = (role?: string): boolean => {
  return role === 'admin' || role === 'direction';
};
