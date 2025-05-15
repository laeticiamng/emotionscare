
import { UserModeType } from "@/types/userMode";

/**
 * Normalize user mode to consistent format
 * This ensures all variants like b2b-admin, b2b_admin, etc. are normalized 
 * to the same format for consistent comparison
 */
export const normalizeUserMode = (mode: UserModeType | string | null | undefined): UserModeType => {
  if (!mode) return 'b2c';
  
  const lowerMode = mode.toLowerCase();
  
  if (lowerMode === 'b2b-admin' || lowerMode === 'b2b_admin' || lowerMode === 'b2badmin') {
    return 'b2b_admin';
  }
  
  if (lowerMode === 'b2b-user' || lowerMode === 'b2b_user' || lowerMode === 'b2buser' || 
      lowerMode === 'b2b-collaborator') {
    return 'b2b_user';
  }
  
  if (lowerMode === 'b2c' || lowerMode === 'individual' || lowerMode === 'user') {
    return 'b2c';
  }
  
  return 'b2c';
};

/**
 * Check if the mode is one of the B2B modes (admin or user)
 */
export const isB2BMode = (mode: UserModeType | string | null | undefined): boolean => {
  const normalized = normalizeUserMode(mode);
  return normalized === 'b2b_admin' || normalized === 'b2b_user';
};

/**
 * Check if the mode is specifically B2B admin
 */
export const isB2BAdminMode = (mode: UserModeType | string | null | undefined): boolean => {
  return normalizeUserMode(mode) === 'b2b_admin';
};

/**
 * Get display name for user mode
 */
export const getUserModeDisplayName = (mode: UserModeType | string | null | undefined): string => {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'b2b_user':
      return 'Collaborateur B2B';
    case 'b2c':
      return 'Utilisateur Particulier';
    default:
      return 'Utilisateur';
  }
};

/**
 * Get home route for user mode
 */
export const getUserModeRoute = (mode: UserModeType | string | null | undefined): string => {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2c':
      return '/b2c/dashboard';
    default:
      return '/';
  }
};
