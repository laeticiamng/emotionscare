
import { UserModeType } from '../types/userMode';

export const normalizeUserMode = (mode: string | null | undefined): UserModeType => {
  if (!mode) return 'b2c';
  
  // Normalize various admin formats to a single format
  if (mode.includes('admin') || mode === 'b2b_admin' || mode === 'b2b-admin') {
    return 'b2b_admin';
  }
  
  // Normalize various user formats to a single format
  if ((mode.includes('b2b') && mode.includes('user')) || mode === 'b2b_user' || mode === 'b2b-user') {
    return 'b2b_user';
  }
  
  // Default to b2c for anything else
  return 'b2c';
};

export const getModeDisplayName = (mode: UserModeType): string => {
  switch (mode) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
    default:
      return 'Particulier';
  }
};

export const getModeLoginPath = (mode: UserModeType | string): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2b_admin':
      return '/login-admin';
    case 'b2b_user':
      return '/login-collaborateur';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

export const getModeDashboardPath = (mode: UserModeType): string => {
  switch (mode) {
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
};
