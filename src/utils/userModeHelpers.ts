
import { UserModeType } from '@/types/userMode';

/**
 * Normalise le mode utilisateur en format standard
 */
export const normalizeUserMode = (mode: string): UserModeType => {
  // Conversion des anciens formats de mode ou des valeurs irrégulières
  if (mode === 'b2b-user' || mode === 'b2b_collaborator' || mode === 'b2b-collaborator') {
    return 'b2b_user';
  }
  if (mode === 'b2b-admin') {
    return 'b2b_admin';
  }
  if (mode === 'b2c-user' || mode === 'personal') {
    return 'b2c';
  }
  
  // Si le mode est déjà dans un format valide, le retourner
  if (mode === 'b2c' || mode === 'b2b_user' || mode === 'b2b_admin') {
    return mode as UserModeType;
  }
  
  // Par défaut, retourner b2c
  return 'b2c';
};

/**
 * Obtenir le chemin du dashboard pour un mode utilisateur donné
 */
export const getModeDashboardPath = (mode: string): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/choose-mode';
  }
};

/**
 * Obtenir le chemin de la page sociale pour un mode utilisateur donné
 */
export const getModeSocialPath = (mode: string | null): string => {
  const normalizedMode = normalizeUserMode(mode || '');
  
  switch (normalizedMode) {
    case 'b2c':
      return '/b2c/social';
    case 'b2b_user':
      return '/b2b/user/social';
    case 'b2b_admin':
      return '/b2b/admin/social';
    default:
      return '/social-cocoon'; // Page sociale par défaut
  }
};

/**
 * Obtenir l'étiquette d'affichage pour un mode utilisateur
 */
export const getUserModeLabel = (mode: UserModeType): string => {
  switch (mode) {
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

/**
 * Obtenir le nom complet pour un mode utilisateur (pour l'affichage)
 */
export const getUserModeDisplayName = (mode: string): string => {
  const normalizedMode = normalizeUserMode(mode);
  return getUserModeLabel(normalizedMode);
};
