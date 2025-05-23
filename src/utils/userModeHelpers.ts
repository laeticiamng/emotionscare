
import { UserMode } from '@/contexts/UserModeContext';

export const normalizeUserMode = (mode: string | UserMode | null | undefined): UserMode => {
  if (!mode) return 'b2c';
  
  const modeStr = String(mode).toLowerCase();
  
  // Mapping des différentes variations possibles
  const modeMap: Record<string, UserMode> = {
    'b2c': 'b2c',
    'b2b_user': 'b2b_user',
    'b2b_admin': 'b2b_admin',
    'b2b-user': 'b2b_user',
    'b2b-admin': 'b2b_admin',
    'user': 'b2b_user',
    'admin': 'b2b_admin',
    'collaborateur': 'b2b_user',
    'administrateur': 'b2b_admin'
  };
  
  return modeMap[modeStr] || 'b2c';
};

export const getModeDashboardPath = (mode: UserMode | string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  const dashboardMap: Record<UserMode, string> = {
    'b2c': '/b2c/dashboard',
    'b2b_user': '/b2b/user/dashboard',
    'b2b_admin': '/b2b/admin/dashboard'
  };
  
  return dashboardMap[normalizedMode];
};

export const getModeLoginPath = (mode: UserMode | string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  const loginMap: Record<UserMode, string> = {
    'b2c': '/b2c/login',
    'b2b_user': '/b2b/user/login',
    'b2b_admin': '/b2b/admin/login'
  };
  
  return loginMap[normalizedMode];
};

export const getModeSocialPath = (mode: UserMode | string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  const socialMap: Record<UserMode, string> = {
    'b2c': '/b2c/social',
    'b2b_user': '/b2b/user/social',
    'b2b_admin': '/b2b/admin/social-cocoon'
  };
  
  return socialMap[normalizedMode];
};

export const getUserModeLabel = (mode: UserMode | string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  const labelMap: Record<UserMode, string> = {
    'b2c': 'Particulier',
    'b2b_user': 'Collaborateur',
    'b2b_admin': 'Administrateur'
  };
  
  return labelMap[normalizedMode];
};

export const getUserModeDisplayName = (mode: UserMode | string | null | undefined): string => {
  return getUserModeLabel(mode);
};

export const getModeColor = (mode: UserMode | string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  const colorMap: Record<UserMode, string> = {
    'b2c': 'bg-blue-50 text-blue-600',
    'b2b_user': 'bg-green-50 text-green-600',
    'b2b_admin': 'bg-purple-50 text-purple-600'
  };
  
  return colorMap[normalizedMode];
};
