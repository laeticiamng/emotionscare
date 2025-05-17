
import { UserRole } from '@/types/user';
import { UserModeType } from '@/types/userMode';

/**
 * Normalizes user role or mode to ensure consistent format across the application
 * Handles several possible formats and always returns snake_case format
 * @param mode The user mode or role string to normalize
 * @returns The normalized user mode as a string
 */
export const normalizeUserMode = (mode: string | UserRole | UserModeType): UserRole | UserModeType => {
  // Standardize to lowercase
  const lowerMode = (mode || '').toLowerCase();
  
  // Handle hyphenated format
  if (lowerMode === 'b2b-user') return 'b2b_user';
  if (lowerMode === 'b2b-admin') return 'b2b_admin';
  
  // Handle shortened formats
  if (lowerMode === 'user') return 'b2b_user';
  if (lowerMode === 'admin') return 'b2b_admin';
  if (lowerMode === 'customer') return 'b2c';
  if (lowerMode === 'personal') return 'b2c';
  
  // Handle standard formats (no change needed)
  if (['b2c', 'b2b_user', 'b2b_admin'].includes(lowerMode)) {
    return lowerMode as UserRole;
  }
  
  // Default to b2c for unknown values
  console.warn(`[userModeHelpers] Unknown mode format normalized: "${mode}" -> "b2c"`);
  return 'b2c';
};

/**
 * Checks if a user role or mode matches the target mode
 * @param userRole The current user role or mode
 * @param targetMode The mode to check against
 * @returns Boolean indicating if the role matches the mode
 */
export const matchUserRoleToMode = (
  userRole: string | UserRole | UserModeType,
  targetMode: string | UserRole | UserModeType
): boolean => {
  const normalizedRole = normalizeUserMode(userRole);
  const normalizedTarget = normalizeUserMode(targetMode);
  
  return normalizedRole === normalizedTarget;
};

/**
 * Gets the dashboard path based on user role
 * @param role The user role
 * @returns The dashboard path for the role
 */
export const getDashboardPathForRole = (role?: string | UserRole | UserModeType): string => {
  if (!role) return '/b2c';
  
  const normalizedRole = normalizeUserMode(role);
  
  switch (normalizedRole) {
    case 'b2b_admin':
      return '/b2b/admin';
    case 'b2b_user':
      return '/b2b/user';
    case 'b2c':
    default:
      return '/b2c';
  }
};

/**
 * Converts a role to a user-friendly display name
 * @param role The user role
 * @returns The display name for the role
 */
export const getRoleDisplayName = (role?: string | UserRole | UserModeType): string => {
  if (!role) return 'Client';
  
  const normalizedRole = normalizeUserMode(role);
  
  switch (normalizedRole) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
      return 'Client';
    default:
      return 'Utilisateur';
  }
};
