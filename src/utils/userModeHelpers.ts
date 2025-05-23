
export const normalizeUserMode = (mode: string | null): string => {
  if (!mode) return '';
  return mode;
};

export const getModeDashboardPath = (mode: string | null): string => {
  switch (mode) {
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

export const getUserModeDisplayName = (mode: string | null): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur B2B';
    case 'b2b_admin':
      return 'Administrateur B2B';
    default:
      return 'Utilisateur';
  }
};

export const getModeLoginPath = (mode: string | null): string => {
  switch (mode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/b2c/login';
  }
};

export const getModeSocialPath = (mode: string | null): string => {
  switch (mode) {
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

export const getUserModeLabel = (mode: string | null): string => {
  return getUserModeDisplayName(mode);
};
