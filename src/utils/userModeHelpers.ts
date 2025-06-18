
import type { UserMode } from '@/types/auth';

export const getUserModeDisplayName = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    default:
      return 'Non défini';
  }
};

export const getModeLoginPath = (mode: UserMode | null): string => {
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

export const getModeDashboardPath = (mode: UserMode | null): string => {
  switch (mode) {
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

export const normalizeUserMode = (mode: string | null): UserMode | null => {
  if (!mode) return null;
  
  const normalized = mode.toLowerCase();
  if (normalized.includes('admin')) return 'b2b_admin';
  if (normalized.includes('user') || normalized.includes('b2b')) return 'b2b_user';
  return 'b2c';
};
