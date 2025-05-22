
import { UserMode } from '@/types/user';

export const getModeDashboardPath = (userMode: UserMode | null): string => {
  if (userMode === 'b2c') {
    return '/b2c/dashboard';
  } else if (userMode === 'b2b_user') {
    return '/b2b/user/dashboard';
  } else if (userMode === 'b2b_admin') {
    return '/b2b/admin/dashboard';
  }
  
  // Default path if no mode is selected
  return '/';
};
