
import { UserModeType } from '@/types/userMode';

/**
 * Normalise le mode utilisateur depuis différentes sources
 */
export function normalizeUserMode(role: string | undefined): UserModeType | null {
  if (!role) return null;
  
  const normalizedRole = role.toLowerCase();
  
  if (normalizedRole.includes('b2c') || normalizedRole === 'individual') {
    return 'b2c';
  }
  
  if (normalizedRole.includes('admin') || normalizedRole === 'b2b_admin') {
    return 'b2b_admin';
  }
  
  if (normalizedRole.includes('user') || normalizedRole === 'b2b_user' || normalizedRole === 'employee') {
    return 'b2b_user';
  }
  
  return 'b2c'; // Défaut
}

/**
 * Obtient le nom d'affichage du mode utilisateur
 */
export function getUserModeDisplayName(userMode: UserModeType | null): string {
  switch (userMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Invité';
  }
}

/**
 * Obtient le chemin du dashboard selon le mode utilisateur
 */
export function getModeDashboardPath(userMode: UserModeType): string {
  switch (userMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Obtient le chemin de connexion selon le mode utilisateur
 */
export function getModeLoginPath(userMode: UserModeType): string {
  switch (userMode) {
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
 * Vérifie si le mode utilisateur nécessite une organisation
 */
export function requiresOrganization(userMode: UserModeType | null): boolean {
  return userMode === 'b2b_user' || userMode === 'b2b_admin';
}

/**
 * Obtient les permissions par défaut pour un mode utilisateur
 */
export function getDefaultPermissions(userMode: UserModeType): string[] {
  switch (userMode) {
    case 'b2c':
      return ['read_own_data', 'write_own_data', 'use_basic_features'];
    case 'b2b_user':
      return ['read_own_data', 'write_own_data', 'use_basic_features', 'view_team_stats'];
    case 'b2b_admin':
      return ['read_own_data', 'write_own_data', 'use_basic_features', 'view_team_stats', 'manage_users', 'view_analytics', 'export_data'];
    default:
      return [];
  }
}
