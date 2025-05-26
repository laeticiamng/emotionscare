
import { UserRole } from './roleUtils';

export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

export const normalizeUserMode = (role: string | UserRole): UserMode => {
  switch (role) {
    case 'b2b_user':
    case 'b2b_admin':
      return role;
    case 'b2c':
    default:
      return 'b2c';
  }
};

export const getModeDashboardPath = (mode: UserMode): string => {
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
