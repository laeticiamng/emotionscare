
/**
 * Utilitaires pour la gestion des routes - VERSION NETTOYÉE
 * TOUTES les routes legacy ont été supprimées
 */

// Routes actuelles uniquement (plus de legacy)
export const CURRENT_ROUTES = {
  // Routes communes
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  B2B_SELECTION: '/b2b/selection',
  
  // Routes B2C
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  B2C_DASHBOARD: '/b2c/dashboard',
  
  // Routes B2B User
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  
  // Routes B2B Admin
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',
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
      return CURRENT_ROUTES.B2B_USER_DASHBOARD;
    case 'b2b_admin':
      return CURRENT_ROUTES.B2B_ADMIN_DASHBOARD;
    case 'b2c':
    default:
      return CURRENT_ROUTES.B2C_DASHBOARD;
  }
}

/**
 * Vérifie si une route est valide (uniquement routes actuelles)
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

/**
 * Migration des anciennes routes vers les nouvelles
 * TEMPORAIRE - sera supprimé après migration complète
 */
export const ROUTE_MIGRATION_MAP = {
  '/login-collaborateur': CURRENT_ROUTES.B2B_USER_LOGIN,
  '/login-admin': CURRENT_ROUTES.B2B_ADMIN_LOGIN,
  '/login': CURRENT_ROUTES.CHOOSE_MODE,
} as const;

/**
 * Obtient la nouvelle route pour une ancienne route
 */
export function getMigratedRoute(legacyPath: string): string {
  return ROUTE_MIGRATION_MAP[legacyPath as keyof typeof ROUTE_MIGRATION_MAP] || legacyPath;
}
