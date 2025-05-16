
import { UserRole } from '@/types/user';
import { UserModeType } from '@/types/userMode';

/**
 * Normalizes user role to a consistent format
 */
export const normalizeUserRole = (role?: UserRole | string | null): string => {
  if (!role) return 'user';
  
  // Convert to lowercase
  const lowerRole = role.toString().toLowerCase();
  
  // Normalize B2B Admin variations
  if (lowerRole.includes('admin') || lowerRole === 'b2b_admin' || lowerRole === 'b2b-admin' || lowerRole === 'b2badmin') {
    return 'b2b_admin';
  }
  
  // Normalize B2B User variations
  if (lowerRole.includes('collab') || lowerRole.includes('b2b') || lowerRole === 'b2b_user' || lowerRole === 'b2b-user') {
    return 'b2b_user';
  }
  
  // Default role is user
  return 'user';
};

/**
 * Checks if the given role is an admin role
 */
export const isAdminRole = (role?: UserRole | string | null): boolean => {
  const normalizedRole = normalizeUserRole(role);
  return normalizedRole === 'b2b_admin' || normalizedRole === 'admin';
};

/**
 * Gets the friendly name of a role for display
 */
export const getRoleName = (role?: UserRole | string | null): string => {
  const normalizedRole = normalizeUserRole(role);
  
  switch (normalizedRole) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'admin':
      return 'Administrateur';
    case 'user':
      return 'Utilisateur';
    default:
      return 'Utilisateur';
  }
};

/**
 * Checks if a user has access to a specific protected route based on their role
 */
export const hasRoleAccess = (userMode: UserModeType | string, requiredRole: UserModeType | string): boolean => {
  // Normalize roles for comparison
  const normalizedUserMode = typeof userMode === 'string' ? userMode : userMode;
  const normalizedRequiredRole = typeof requiredRole === 'string' ? requiredRole : requiredRole;
  
  // Admin can access all routes
  if (normalizedUserMode === 'b2b_admin') return true;

  // Direct match
  return normalizedUserMode === normalizedRequiredRole;
};

/**
 * Get the appropriate login path for a given role
 */
export const getRoleLoginPath = (role: UserModeType | string): string => {
  switch (role) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/login';
  }
};
