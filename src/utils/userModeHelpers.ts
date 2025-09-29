
export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export const getUserModeDisplayName = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    default:
      return 'Non défini';
  }
};

export const getModeLoginPath = (mode: UserMode | null): string => {
  switch (mode) {
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

export const getModeDashboardPath = (mode: UserMode | null): string => {
  switch (mode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

export const normalizeUserMode = (mode: string | UserMode | null): UserMode | null => {
  if (!mode) return null;
  const modeStr = String(mode).toLowerCase();
  
  switch (modeStr) {
    case 'b2c':
    case 'b2b_user':
    case 'b2b_admin':
    case 'admin':
      return modeStr as UserMode;
    default:
      return null;
  }
};
