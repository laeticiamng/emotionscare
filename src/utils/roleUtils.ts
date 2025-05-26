
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Utilisateur B2B';
    case 'b2b_admin':
      return 'Administrateur B2B';
    default:
      return 'Utilisateur';
  }
};

export const getRolePermissions = (role: UserRole) => {
  return {
    canAccessAdmin: role === 'b2b_admin',
    canAccessB2B: role === 'b2b_user' || role === 'b2b_admin',
    canAccessB2C: role === 'b2c',
  };
};
