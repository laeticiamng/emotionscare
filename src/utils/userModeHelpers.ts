
import { UserMode } from '@/types/auth';

/**
 * Normalizes user mode strings to ensure consistent format
 * This is important when comparing modes across different parts of the app
 */
export const normalizeUserMode = (mode?: string): UserMode => {
  if (!mode) return 'b2c'; // Default to b2c
  
  // Convert to lowercase and handle various formats
  const normalized = mode.toLowerCase().replace('-', '_');
  
  // Handle various possible formats
  if (normalized.includes('admin')) return 'b2b_admin';
  if (normalized.includes('b2b') && !normalized.includes('admin')) return 'b2b_user';
  if (normalized === 'b2c' || normalized === 'individual') return 'b2c';
  
  return 'b2c'; // Default fallback
};

/**
 * Returns the appropriate dashboard path based on user mode
 */
export const getModeDashboardPath = (userMode?: UserMode): string => {
  switch (userMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/';
  }
};

/**
 * Returns the login path for a specific user mode
 */
export const getModeLoginPath = (mode?: UserMode): string => {
  switch (mode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/b2c/login';
  }
};

/**
 * Returns the appropriate label for a user mode
 */
export const getUserModeLabel = (mode?: UserMode): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administration';
    default:
      return 'Utilisateur';
  }
};

/**
 * Create a type guard to verify if a string is a valid UserMode
 */
export const isValidUserMode = (mode: string): mode is UserMode => {
  return ['b2c', 'b2b_user', 'b2b_admin'].includes(mode);
};

/**
 * Returns a display name for a user mode
 */
export const getUserModeDisplayName = (mode: string): string => {
  const normalized = normalizeUserMode(mode);
  return getUserModeLabel(normalized);
};

/**
 * Returns the appropriate social path based on user mode
 */
export const getModeSocialPath = (userMode?: UserMode): string => {
  switch (userMode) {
    case 'b2c':
      return '/b2c/social';
    case 'b2b_user':
      return '/b2b/user/social';
    case 'b2b_admin':
      return '/b2b/admin/social';
    default:
      return '/social-cocoon';
  }
};
