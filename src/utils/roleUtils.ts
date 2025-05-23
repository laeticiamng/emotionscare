
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
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

export const isAdminRole = (role: string): boolean => {
  return role === 'b2b_admin' || role === 'admin';
};

export const isB2BRole = (role: string): boolean => {
  return role === 'b2b_user' || role === 'b2b_admin';
};
