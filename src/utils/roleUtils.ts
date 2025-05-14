
import { UserRole } from '@/types/types';

/**
 * Check if the provided role is an admin role
 */
export const isAdminRole = (role: UserRole | string): boolean => {
  return role === 'b2b_admin' || role === 'b2b-admin';
};

/**
 * Get user-friendly name for a role
 */
export const getRoleName = (role: UserRole | string): string => {
  switch (role) {
    case 'b2c':
      return 'Utilisateur Personnel';
    case 'b2b_user':
    case 'b2b-user':
      return 'Collaborateur';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'Administrateur';
    case 'personal':
      return 'Profil Personnel';
    case 'team':
      return 'Membre d\'équipe';
    case 'b2b-collaborator':
      return 'Collaborateur';
    default:
      return 'Utilisateur';
  }
};
