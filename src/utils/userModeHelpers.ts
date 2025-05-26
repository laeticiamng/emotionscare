
import { UserRole } from '@/types/user';

export const normalizeUserMode = (mode: string | UserRole): UserRole => {
  switch (mode) {
    case 'b2b_user':
    case 'b2b_admin':
    case 'b2c':
      return mode as UserRole;
    default:
      return 'b2c';
  }
};

export const getModeDashboardPath = (mode: UserRole): string => {
  switch (mode) {
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
};

export const getUserModeDisplayName = (mode: UserRole): string => {
  switch (mode) {
    case 'b2c':
      return 'Personnel';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Personnel';
  }
};
