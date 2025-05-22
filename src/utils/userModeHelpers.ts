
import { UserModeType } from '@/types/userMode';
import { UserRole } from '@/types/user';

/**
 * Maps from route paths to user modes
 */
export const pathToUserMode = (path: string): UserModeType | null => {
  const pathLower = path.toLowerCase();
  
  if (pathLower.includes('/b2c')) {
    return 'b2c';
  } else if (pathLower.includes('/b2b/admin') || pathLower.includes('/admin')) {
    return 'b2b_admin';
  } else if (pathLower.includes('/b2b/user') || pathLower.includes('/collaborator')) {
    return 'b2b_user';
  }
  
  return null;
};

/**
 * Get the dashboard path for a specific user mode
 */
export const getModeDashboardPath = (userMode: UserModeType | null): string => {
  if (!userMode) return '/choose-mode';
  
  switch (normalizeUserMode(userMode)) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/dashboard';
  }
};

/**
 * Get display name for a user mode
 */
export const getUserModeDisplayName = (userMode: UserModeType | null): string => {
  if (!userMode) return 'Visiteur';
  
  switch (normalizeUserMode(userMode)) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

/**
 * Normalize user mode/role to consistent format (handles different formats)
 */
export const normalizeUserMode = (mode?: UserModeType | UserRole | string | null): UserModeType => {
  if (!mode) return 'b2c';
  
  const normalizedMode = mode.toLowerCase().replace('-', '_');
  
  if (normalizedMode.includes('admin')) {
    return 'b2b_admin';
  }
  
  if (normalizedMode.includes('user') || normalizedMode.includes('collaborat')) {
    return 'b2b_user';
  }
  
  if (normalizedMode.includes('b2c') || normalizedMode.includes('particulier')) {
    return 'b2c';
  }
  
  return 'b2c'; // Default user mode
};

/**
 * Check if a user has admin privileges
 */
export const isAdmin = (userMode: UserModeType | string | null): boolean => {
  if (!userMode) return false;
  return normalizeUserMode(userMode) === 'b2b_admin';
};

/**
 * Check if a user is a B2B user (collaborator)
 */
export const isB2BUser = (userMode: UserModeType | string | null): boolean => {
  if (!userMode) return false;
  return normalizeUserMode(userMode) === 'b2b_user';
};

/**
 * Check if a user is a B2C user (individual)
 */
export const isB2C = (userMode: UserModeType | string | null): boolean => {
  if (!userMode) return false;
  return normalizeUserMode(userMode) === 'b2c';
};

/**
 * Check if a user is any type of B2B user (admin or normal user)
 */
export const isAnyB2B = (userMode: UserModeType | string | null): boolean => {
  if (!userMode) return false;
  const mode = normalizeUserMode(userMode);
  return mode === 'b2b_admin' || mode === 'b2b_user';
};
