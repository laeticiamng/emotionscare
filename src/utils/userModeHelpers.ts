
import { normalizeUserMode } from './normalizeUserMode';

export { normalizeUserMode };

export const getDashboardPath = (userRole: string): string => {
  const normalizedRole = normalizeUserMode(userRole);
  
  switch (normalizedRole) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/b2c/dashboard';
  }
};

export const getLoginPath = (userRole: string): string => {
  const normalizedRole = normalizeUserMode(userRole);
  
  switch (normalizedRole) {
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

export default {
  normalizeUserMode,
  getDashboardPath,
  getLoginPath
};
