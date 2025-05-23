
export const normalizeUserMode = (mode: string): string => {
  if (!mode) return 'b2c';
  
  const modeStr = mode.toLowerCase().replace(/-/g, '_');
  
  if (modeStr.includes('admin') || modeStr === 'b2b_admin') {
    return 'b2b_admin';
  }
  if (modeStr.includes('b2b') || modeStr === 'b2b_user' || modeStr === 'b2b_collaborator') {
    return 'b2b_user';
  }
  return 'b2c';
};

export const getUserModeLabel = (mode: string): string => {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    default:
      return 'Utilisateur';
  }
};

export const getUserModeDisplayName = (mode: string | null): string => {
  if (!mode) return 'Non défini';
  
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Non défini';
  }
};

export const getModeDashboardPath = (mode: string): string => {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    default:
      return '/choose-mode';
  }
};

export const getModeSocialPath = (mode: string): string => {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c/social';
    case 'b2b_user':
      return '/b2b/user/social';
    case 'b2b_admin':
      return '/b2b/admin/dashboard'; // Admin doesn't have social
    default:
      return '/choose-mode';
  }
};

export const getModeLoginPath = (mode: string): string => {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    default:
      return '/b2c/login';
  }
};
