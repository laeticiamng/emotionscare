
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

export const getModeLoginPath = (userMode: UserMode | null): string => {
  if (userMode === 'b2c') {
    return '/b2c/login';
  } else if (userMode === 'b2b_user') {
    return '/b2b/user/login';
  } else if (userMode === 'b2b_admin') {
    return '/b2b/admin/login';
  }
  
  // Default login path
  return '/b2c/login';
};

export const normalizeUserMode = (mode: string | null): string => {
  if (!mode) return '';
  
  // Convert variants to standard format
  const normalizedMode = mode.toLowerCase()
    .replace('-', '_')
    .replace('admin', 'b2b_admin')
    .replace('collaborator', 'b2b_user')
    .replace('b2b-user', 'b2b_user')
    .replace('b2b-admin', 'b2b_admin');
    
  return normalizedMode;
};
