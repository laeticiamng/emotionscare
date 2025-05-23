
import { UserModeType } from '@/types/userMode';
import { UserRole } from '@/types/user';

/**
 * Normalise le mode utilisateur
 */
export function normalizeUserMode(mode?: string | null): UserModeType {
  if (!mode) return 'b2c';
  
  const normalizedMode = mode.toLowerCase().replace('-', '_');
  
  if (normalizedMode.includes('admin')) {
    return 'b2b_admin';
  } else if (normalizedMode.includes('user') || normalizedMode.includes('b2b')) {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
}

/**
 * Obtient le nom d'affichage pour un mode utilisateur
 */
export function getUserModeDisplayName(mode?: string | null): string {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
}

/**
 * Obtient le chemin du tableau de bord pour un mode utilisateur spécifique
 */
export function getModeDashboardPath(mode?: string | null): string {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/choose-mode';
  }
}

/**
 * Obtient le chemin de connexion pour un mode utilisateur spécifique
 */
export function getModeLoginPath(mode?: string | null): string {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    default:
      return '/choose-mode';
  }
}

/**
 * Obtient le chemin social pour un mode utilisateur spécifique
 */
export function getModeSocialPath(mode?: string | null): string {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c/social';
    case 'b2b_user':
      return '/b2b/user/social';
    case 'b2b_admin':
      return '/b2b/admin/social-cocoon';
    default:
      return '/social';
  }
}

/**
 * Vérifie si un mode est valide
 */
export function isValidUserMode(mode?: string | null): boolean {
  if (!mode) return false;
  
  const normalized = normalizeUserMode(mode);
  return ['b2c', 'b2b_user', 'b2b_admin'].includes(normalized);
}

/**
 * Convertit un rôle utilisateur en mode utilisateur
 */
export function roleToUserMode(role?: UserRole | string | null): UserModeType {
  if (!role) return 'b2c';
  
  const roleStr = String(role).toLowerCase();
  
  if (roleStr.includes('admin')) {
    return 'b2b_admin';
  } else if (roleStr.includes('user') || roleStr.includes('b2b')) {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
}

/**
 * Obtient le préfixe de chemin pour un mode utilisateur
 */
export function getUserModePathPrefix(mode?: string | null): string {
  const normalized = normalizeUserMode(mode);
  
  switch (normalized) {
    case 'b2c':
      return '/b2c';
    case 'b2b_user':
      return '/b2b/user';
    case 'b2b_admin':
      return '/b2b/admin';
    default:
      return '';
  }
}
