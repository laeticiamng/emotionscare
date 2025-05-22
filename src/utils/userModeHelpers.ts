
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
  return '/choose-mode';
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

export const getModeJournalPath = (userMode: UserMode | null): string => {
  if (userMode === 'b2c') {
    return '/b2c/journal';
  } else if (userMode === 'b2b_user') {
    return '/b2b/user/journal';
  } else if (userMode === 'b2b_admin') {
    // Admins don't have journal access, redirect to dashboard
    return '/b2b/admin/dashboard';
  }
  
  return '/choose-mode';
};

export const getModeMusicPath = (userMode: UserMode | null): string => {
  if (userMode === 'b2c') {
    return '/b2c/music';
  } else if (userMode === 'b2b_user') {
    return '/b2b/user/music';
  } else if (userMode === 'b2b_admin') {
    // Admins don't have music access, redirect to dashboard
    return '/b2b/admin/dashboard';
  }
  
  return '/choose-mode';
};

export const getModeAudioPath = (userMode: UserMode | null): string => {
  if (userMode === 'b2c') {
    return '/b2c/audio';
  } else if (userMode === 'b2b_user') {
    return '/b2b/user/audio';
  } else if (userMode === 'b2b_admin') {
    // Admins don't have audio access, redirect to dashboard
    return '/b2b/admin/dashboard';
  }
  
  return '/choose-mode';
};

export const getModeCoachPath = (userMode: UserMode | null): string => {
  if (userMode === 'b2c') {
    return '/b2c/coach';
  } else if (userMode === 'b2b_user') {
    return '/b2b/user/coach';
  } else if (userMode === 'b2b_admin') {
    // Admins don't have coach access, redirect to dashboard
    return '/b2b/admin/dashboard';
  }
  
  return '/choose-mode';
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

export const getUserModeDisplayName = (mode: string | null): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};
