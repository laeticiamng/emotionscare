
/**
 * Utilitaires pour la gestion des routes et redirections - VERSION NETTOYÉE
 */

// Routes actuelles (plus de legacy)
export const CURRENT_ROUTES = {
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2C_LOGIN: '/b2c/login',
  CHOOSE_MODE: '/choose-mode',
  B2B_SELECTION: '/b2b/selection',
  HOME: '/',
} as const;

/**
 * Obtient la route de login appropriée selon le rôle
 */
export function getLoginRoute(role: 'b2c' | 'b2b_user' | 'b2b_admin'): string {
  switch (role) {
    case 'b2b_user':
      return CURRENT_ROUTES.B2B_USER_LOGIN;
    case 'b2b_admin':
      return CURRENT_ROUTES.B2B_ADMIN_LOGIN;
    case 'b2c':
    default:
      return CURRENT_ROUTES.B2C_LOGIN;
  }
}

/**
 * Obtient la route de dashboard appropriée selon le rôle
 */
export function getDashboardRoute(role: 'b2c' | 'b2b_user' | 'b2b_admin'): string {
  switch (role) {
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'b2c':
    default:
      return '/b2c/dashboard';
  }
}

/**
 * Vérifie si une route est valide
 */
export function isValidRoute(path: string): boolean {
  const validRoutes = Object.values(CURRENT_ROUTES);
  return validRoutes.includes(path as any);
}

/**
 * Redirige vers la route appropriée selon le contexte utilisateur
 */
export function getContextualRedirect(userRole?: string): string {
  if (!userRole) {
    return CURRENT_ROUTES.CHOOSE_MODE;
  }
  
  return getDashboardRoute(userRole as any);
}
