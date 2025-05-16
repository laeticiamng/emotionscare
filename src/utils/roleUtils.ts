
import { UserRole } from '@/types/user';

export const getRoleName = (role: UserRole | string): string => {
  switch (role) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2c':
      return 'Utilisateur';
    default:
      return 'Utilisateur';
  }
};
