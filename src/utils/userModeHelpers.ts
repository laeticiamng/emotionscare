
import { UserMode } from '@/types/auth';

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
      return '/login';
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
