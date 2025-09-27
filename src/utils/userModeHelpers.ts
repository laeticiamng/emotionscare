
export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

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
    default:
      return '/';
  }
};

export const normalizeUserMode = (mode: string | null): UserMode => {
  switch (mode) {
    case 'b2c':
    case 'consumer':
    case 'personal':
      return 'b2c';
    case 'b2b_user':
    case 'employee':
    case 'user':
      return 'b2b_user';
    case 'b2b_admin':
    case 'admin':
    case 'manager':
      return 'b2b_admin';
    default:
      return 'b2c';
  }
};
