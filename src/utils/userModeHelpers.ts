
import { UserModeType } from '@/types/userMode';

/**
 * Normalizes various user role/mode formats to a consistent format
 */
export const normalizeUserMode = (mode: string | null | undefined): UserModeType => {
  if (!mode) return 'b2c';
  
  const lowercaseMode = typeof mode === 'string' ? mode.toLowerCase() : '';
  
  if (lowercaseMode.includes('admin')) return 'b2b_admin';
  if (lowercaseMode.includes('b2b') || lowercaseMode.includes('user') || lowercaseMode.includes('collaborateur')) return 'b2b_user';
  
  return 'b2c';
};

/**
 * Get the dashboard path for a specific user mode
 */
export const getModeDashboardPath = (mode: UserModeType): string => {
  switch (mode) {
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
 * Get the login path for a specific user mode
 */
export const getModeLoginPath = (mode: UserModeType | null): string => {
  switch (mode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/choose-mode';
  }
};

/**
 * Get display name for a user mode
 */
export const getUserModeDisplayName = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    default:
      return 'Utilisateur';
  }
};

export default {
  normalizeUserMode,
  getModeDashboardPath,
  getModeLoginPath,
  getUserModeDisplayName
};
