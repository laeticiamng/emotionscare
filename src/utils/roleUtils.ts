
import { UserRole } from '@/types/user';

export const getRoleName = (role?: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'b2b_admin':
      return 'Administrateur B2B';
    case 'b2b_user':
      return 'Utilisateur B2B';
    case 'b2c':
      return 'Utilisateur B2C';
    case 'coach':
      return 'Coach';
    case 'therapist':
      return 'Thérapeute';
    case 'user':
      return 'Utilisateur';
    default:
      return 'Utilisateur';
  }
};

export const getRoleDescription = (role?: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Accès complet à toutes les fonctionnalités';
    case 'b2b_admin':
      return 'Gestion des utilisateurs et des données de l\'entreprise';
    case 'b2b_user':
      return 'Accès aux fonctionnalités B2B standard';
    case 'b2c':
      return 'Accès aux fonctionnalités personnelles';
    case 'coach':
      return 'Accompagnement et coaching des utilisateurs';
    case 'therapist':
      return 'Suivi thérapeutique des utilisateurs';
    case 'user':
      return 'Accès standard à l\'application';
    default:
      return 'Accès standard à l\'application';
  }
};

// Add the missing isAdminRole function
export const isAdminRole = (role?: UserRole): boolean => {
  return role === 'admin' || role === 'b2b_admin';
};
