
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
