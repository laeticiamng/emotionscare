
/**
 * Utility functions for role-based checks
 */

/**
 * Check if a user has admin or direction privileges
 * @param role The user's role
 * @returns boolean indicating if the user has admin privileges
 */
export const isAdminRole = (role?: string): boolean => {
  if (!role) return false;
  const adminRoles = ['admin', 'direction', 'Admin', 'Direction'];
  return adminRoles.includes(role);
};

/**
 * Check if a user has standard user role
 * @param role The user's role
 * @returns boolean indicating if the user is a standard user
 */
export const isUserRole = (role?: string): boolean => {
  if (!role) return false;
  const userRoles = ['user', 'employee', 'Utilisateur', 'User'];
  return userRoles.includes(role) || !isAdminRole(role); // Si ce n'est pas admin, c'est user par défaut
};

/**
 * Get a friendly role display name
 * @param role The user's role
 * @returns A user-friendly name for the role
 */
export const getRoleDisplayName = (role?: string): string => {
  if (isAdminRole(role)) return 'Direction';
  if (role === 'Manager') return 'Manager';
  return 'Utilisateur';
};
