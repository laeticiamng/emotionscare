
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

export const isAdminRole = (role: UserRole): boolean => {
  return role === 'admin' || role === 'b2b_admin';
};

export const isB2BRole = (role: UserRole): boolean => {
  return role === 'b2b_user' || role === 'b2b_admin';
};
