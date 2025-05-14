
import type { UserRole } from '@/types/types';

/**
 * Vérifie si l'utilisateur a le rôle requis
 */
export const hasRoleAccess = (userRole?: UserRole, requiredRole?: string): boolean => {
  if (!userRole || !requiredRole) return false;

  // Pour la rétrocompatibilité avec les anciens formats de rôle
  const normalizedUserRole = userRole.replace('_', '-');
  const normalizedRequiredRole = requiredRole.replace('_', '-');

  // Si les rôles correspondent exactement
  if (normalizedUserRole === normalizedRequiredRole) return true;

  // Les admins B2B ont accès aux fonctionnalités utilisateur B2B
  if (normalizedUserRole === 'b2b-admin' && normalizedRequiredRole === 'b2b-user') return true;

  return false;
};

/**
 * Vérifie si un rôle est un rôle d'administration
 */
export const isAdminRole = (role?: UserRole): boolean => {
  if (!role) return false;
  return role === 'b2b_admin' || role === 'b2b-admin';
};

/**
 * Obtient le chemin de connexion pour un rôle spécifique
 */
export const getRoleLoginPath = (role: string): string => {
  switch (role) {
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/login';
    case 'b2b_user':
    case 'b2b-user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

/**
 * Obtient le chemin d'accueil pour un rôle spécifique
 */
export const getRoleHomePath = (role: string): string => {
  switch (role) {
    case 'b2b_admin':
    case 'b2b-admin':
      return '/b2b/admin/dashboard';
    case 'b2b_user':
    case 'b2b-user':
      return '/b2b/user/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
};
