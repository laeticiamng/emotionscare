
import { UserRole } from '@/types/user';

export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export const normalizeUserMode = (role: UserRole | string | undefined | null): UserModeType => {
  if (!role) return 'b2c';
  
  const roleStr = String(role).toLowerCase();
  
  if (roleStr.includes('admin') || roleStr === 'b2b_admin') {
    return 'b2b_admin';
  }
  
  if (roleStr.includes('b2b') || roleStr === 'b2b_user') {
    return 'b2b_user';
  }
  
  return 'b2c';
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

export const getModeLoginPath = (mode: UserModeType): string => {
  switch (mode) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

export const isAdminMode = (mode: UserModeType): boolean => {
  return mode === 'b2b_admin';
};

export const isB2BMode = (mode: UserModeType): boolean => {
  return mode === 'b2b_admin' || mode === 'b2b_user';
};

export const isB2CMode = (mode: UserModeType): boolean => {
  return mode === 'b2c';
};

const useUserModeHelpers = () => {
  return {
    normalizeUserMode,
    getModeDashboardPath,
    getModeLoginPath,
    isAdminMode,
    isB2BMode,
    isB2CMode
  };
};

export default useUserModeHelpers;
