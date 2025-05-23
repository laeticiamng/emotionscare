
import { UserRole } from '@/types/user';

/**
 * Vérifie si le rôle est un rôle administrateur
 */
export const isAdminRole = (role: string): boolean => {
  return role === 'admin' || role === 'b2b_admin';
};

/**
 * Obtient le nom lisible d'un rôle
 */
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

export default {
  isAdminRole,
  getRoleName
};
