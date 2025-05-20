
import { UserModeType } from '@/types/userMode';

/**
 * Normalizes a user mode string to ensure consistent format
 * @param mode The user mode string to normalize
 * @returns Normalized user mode string
 */
export const normalizeUserMode = (mode: string | UserModeType): string => {
  if (!mode) return 'b2c'; // Default to b2c
  
  const modeStr = String(mode).toLowerCase();
  
  // Handle variants with dashes vs underscores
  if (modeStr.includes('b2c') || modeStr.includes('particulier')) {
    return 'b2c';
  }
  
  if (modeStr.includes('admin') || modeStr.includes('rh')) {
    return 'b2b_admin';
  }
  
  if (modeStr.includes('b2b') || modeStr.includes('user') || modeStr.includes('collaborateur')) {
    return 'b2b_user';
  }
  
  return 'b2c'; // Default fallback
};

/**
 * Gets a display label for a user mode
 * @param mode The user mode
 * @returns Human-readable label
 */
export const getUserModeLabel = (mode: string | UserModeType): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    default:
      return 'Utilisateur';
  }
};

/**
 * Checks if two modes are equivalent after normalization
 * @param mode1 First mode to compare
 * @param mode2 Second mode to compare
 * @returns True if the modes are equivalent
 */
export const areModesEquivalent = (mode1: string | UserModeType, mode2: string | UserModeType): boolean => {
  return normalizeUserMode(mode1) === normalizeUserMode(mode2);
};

/**
 * Gets the appropriate dashboard path for a given user mode
 * @param mode The user mode
 * @returns Dashboard path for the mode
 */
export const getModeDashboardPath = (mode: string | UserModeType): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/b2c/dashboard'; // Default fallback
  }
};

/**
 * Gets the appropriate settings path for a given user mode
 * @param mode The user mode
 * @returns Settings path for the mode
 */
export const getModeSettingsPath = (mode: string | UserModeType): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/settings';
    case 'b2b_user':
      return '/b2b/user/settings';
    case 'b2b_admin':
      return '/b2b/admin/settings';
    default:
      return '/b2c/settings'; // Default fallback
  }
};

/**
 * Gets a color theme for a specific user mode
 * @param mode The user mode
 * @returns CSS class or color value
 */
export const getModeThemeColor = (mode: string | UserModeType): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return 'blue';
    case 'b2b_user':
      return 'green';
    case 'b2b_admin':
      return 'purple';
    default:
      return 'blue'; // Default fallback
  }
};

/**
 * Gets the icon name for a specific user mode
 * @param mode The user mode
 * @returns Icon name suitable for use with Lucide icons
 */
export const getModeIconName = (mode: string | UserModeType): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return 'user';
    case 'b2b_user':
      return 'users';
    case 'b2b_admin':
      return 'shield';
    default:
      return 'user'; // Default fallback
  }
};
