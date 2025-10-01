// @ts-nocheck

import { UserModeType } from '@/types/userMode';

export const getUserModeDisplayName = (mode: UserModeType): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    default:
      return 'Utilisateur';
  }
};

export const getUserModeDescription = (mode: UserModeType): string => {
  switch (mode) {
    case 'b2c':
      return 'Accès personnel à toutes les fonctionnalités de bien-être';
    case 'b2b_user':
      return 'Accès collaborateur avec suivi équipe';
    case 'b2b_admin':
      return 'Accès administrateur avec tableau de bord complet';
    default:
      return 'Mode utilisateur standard';
  }
};
