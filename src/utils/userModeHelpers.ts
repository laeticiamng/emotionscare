
import type { UserMode } from '@/types/auth';
import { UNIFIED_ROUTES } from './routeUtils';

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
      return UNIFIED_ROUTES.B2C_LOGIN;
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_LOGIN;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_LOGIN;
    default:
      return UNIFIED_ROUTES.CHOOSE_MODE;
  }
};

export const getModeDashboardPath = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return UNIFIED_ROUTES.B2C_DASHBOARD;
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_DASHBOARD;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
    default:
      return UNIFIED_ROUTES.HOME;
  }
};

export const normalizeUserMode = (mode: string | null): UserMode | null => {
  if (!mode) return null;
  
  const normalized = mode.toLowerCase();
  if (normalized.includes('admin')) return 'b2b_admin';
  if (normalized.includes('user') || normalized.includes('b2b')) return 'b2b_user';
  return 'b2c';
};
