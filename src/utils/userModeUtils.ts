
import { UserRole } from '@/types/auth';

/**
 * Normalize user mode string to a consistent format
 * This handles different formats like b2b-admin, b2b_admin, etc.
 */
export const normalizeUserMode = (mode: string | null | undefined): string => {
  if (!mode) return 'b2c';
  
  // Convert to lowercase
  const lowerMode = mode.toLowerCase();
  
  // Normalize B2B Admin variations
  if (lowerMode === 'b2b-admin' || lowerMode === 'b2b_admin' || lowerMode === 'b2badmin') {
    return 'b2b_admin';
  }
  
  // Normalize B2B User variations
  if (lowerMode === 'b2b-user' || lowerMode === 'b2b_user' || lowerMode === 'b2buser' || 
      lowerMode === 'b2b-collaborator' || lowerMode === 'b2bcollaborator') {
    return 'b2b_user';
  }
  
  // Normalize B2C variations
  if (lowerMode === 'b2c' || lowerMode === 'individual' || lowerMode === 'user') {
    return 'b2c';
  }
  
  // Default if no match
  return 'b2c';
};

/**
 * Convert user role to user mode
 */
export const userRoleToMode = (role: UserRole): string => {
  if (role.includes('admin') || role === 'b2b_admin' || role === 'b2b-admin') {
    return 'b2b_admin';
  }
  if (role.includes('b2b') || role === 'b2b_user' || role === 'b2b-user' || role === 'b2b-collaborator') {
    return 'b2b_user';
  }
  return 'b2c';
};

/**
 * Check if a mode is a valid user mode
 */
export const isValidUserMode = (mode: string): boolean => {
  const normalized = normalizeUserMode(mode);
  return ['b2c', 'b2b_user', 'b2b_admin'].includes(normalized);
};

/**
 * Get display name for a user mode
 */
export const getUserModeDisplayName = (mode: string): string => {
  const normalized = normalizeUserMode(mode);
  
  switch(normalized) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'b2b_user':
      return 'Collaborateur B2B';
    default:
      return 'Utilisateur';
  }
};
