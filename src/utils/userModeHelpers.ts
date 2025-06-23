
type UserMode = 'b2c' | 'b2b-user' | 'b2b-admin' | 'guest';

export const getModeLoginPath = (mode: UserMode): string => {
  switch (mode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b-user':
      return '/b2b/user/login';
    case 'b2b-admin':
      return '/b2b/admin/login';
    default:
      return '/choose-mode';
  }
};

export const getModeLabel = (mode: UserMode): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b-user':
      return 'Utilisateur B2B';
    case 'b2b-admin':
      return 'Administrateur B2B';
    default:
      return 'Invité';
  }
};
