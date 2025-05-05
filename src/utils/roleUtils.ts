
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

/**
 * Check if a user has standard user role
 * @param role The user's role
 * @returns boolean indicating if the user is a standard user
 */
export const isUserRole = (role?: string): boolean => {
  return role === 'user' || role === 'employee' || role === 'Médecin' || 
         role === 'Infirmier' || role === 'Aide-soignant' || role === 'Interne';
};

/**
 * Get a friendly role display name
 * @param role The user's role
 * @returns A user-friendly name for the role
 */
export const getRoleDisplayName = (role?: string): string => {
  if (isAdminRole(role)) return 'Direction';
  if (role) return role;
  return 'Utilisateur';
};
