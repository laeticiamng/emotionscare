
import { UserRole } from '@/types/user';
import { normalizeUserMode } from './userModeHelpers';

/**
 * Convert user role to user mode
 */
export const userRoleToMode = (role: UserRole): string => {
  const roleStr = role as string;
  if (roleStr.includes('admin') || roleStr === 'b2b_admin' || roleStr === 'b2b-admin') {
    return 'b2b_admin';
  }
  if (roleStr.includes('b2b') || roleStr === 'b2b_user' || roleStr === 'b2b-user' || roleStr === 'b2b-collaborator') {
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
