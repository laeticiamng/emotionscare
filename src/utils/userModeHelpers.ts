
import { UserModeType } from '@/types/userMode';

export const normalizeUserMode = (mode: string | null | undefined): string => {
  if (!mode) return '';
  
  if (mode === 'b2c' || mode === 'particulier') {
    return 'b2c';
  } else if (mode === 'b2b_user' || mode === 'collaborateur') {
    return 'b2b_user';
  } else if (mode === 'b2b_admin' || mode === 'administrateur') {
    return 'b2b_admin';
  }
  
  return '';
};

export const getUserModeDisplayName = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'b2b_user':
      return 'Collaborateur B2B';
    default:
      return 'Utilisateur';
  }
};

export const getModeLoginPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/login';
  }
};

export const getModeDashboardPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/choose-mode';
  }
};

export const getModeJournalPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/journal';
    case 'b2b_user':
      return '/b2b/user/journal';
    case 'b2b_admin':
      return '/b2b/admin/journal';
    default:
      return '/b2c/journal';
  }
};

export const getModeMusicPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/music';
    case 'b2b_user':
      return '/b2b/user/music';
    case 'b2b_admin':
      return '/b2b/admin/music';
    default:
      return '/b2c/music';
  }
};

export const getModeAudioPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/audio';
    case 'b2b_user':
      return '/b2b/user/audio';
    case 'b2b_admin':
      return '/b2b/admin/audio';
    default:
      return '/b2c/audio';
  }
};

export const getModeCoachPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/coach';
    case 'b2b_user':
      return '/b2b/user/coach';
    case 'b2b_admin':
      return '/b2b/admin/coach';
    default:
      return '/b2c/coach';
  }
};

export const getModeProgressPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/progress';
    case 'b2b_user':
      return '/b2b/user/progress';
    case 'b2b_admin':
      return '/b2b/admin/progress';
    default:
      return '/b2c/progress';
  }
};

export const getModeVRPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/vr';
    case 'b2b_user':
      return '/b2b/user/vr';
    case 'b2b_admin':
      return '/b2b/admin/vr';
    default:
      return '/b2c/vr';
  }
};

export const getModeSocialPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/social';
    case 'b2b_user':
      return '/b2b/user/social';
    case 'b2b_admin':
      return '/b2b/admin/social';
    default:
      return '/b2c/social';
  }
};

export const getModeGamificationPath = (mode: string | null | undefined): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/gamification';
    case 'b2b_user':
      return '/b2b/user/gamification';
    case 'b2b_admin':
      return '/b2b/admin/gamification';
    default:
      return '/b2c/gamification';
  }
};
