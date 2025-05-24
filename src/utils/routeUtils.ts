
/**
 * Utilitaires pour la gestion des routes et redirections
 */

export const LEGACY_ROUTES = {
  '/login-collaborateur': '/b2b/user/login',
  '/login-admin': '/b2b/admin/login',
  '/login': '/choose-mode',
} as const;

export const CURRENT_ROUTES = {
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2C_LOGIN: '/b2c/login',
  CHOOSE_MODE: '/choose-mode',
  B2B_SELECTION: '/b2b/selection',
} as const;

/**
 * Convertit une route legacy vers la nouvelle route
 */
export function migrateLegacyRoute(path: string): string {
  return LEGACY_ROUTES[path as keyof typeof LEGACY_ROUTES] || path;
}

/**
 * Vérifie si une route est obsolète
 */
export function isLegacyRoute(path: string): boolean {
  return path in LEGACY_ROUTES;
}
