
/**
 * Utilitaires pour la gestion des routes - VERSION UNIFIÉE SANS DOUBLONS
 * RÈGLE ABSOLUE : Chaque fonctionnalité a UN SEUL chemin d'accès unique
 */

// Routes principales - CHEMINS UNIQUES ABSOLUS
export const UNIFIED_ROUTES = {
  // Routes publiques
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  B2B_SELECTION: '/b2b/selection',
  
  // Routes B2C - UNIQUES
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  B2C_DASHBOARD: '/b2c/dashboard',
  
  // Routes B2B User - UNIQUES
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  
  // Routes B2B Admin - UNIQUES
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',

  // FONCTIONNALITÉS COMMUNES - UN SEUL CHEMIN ABSOLU
  SCAN: '/scan',
  MUSIC: '/music',
  COACH: '/coach',
  JOURNAL: '/journal',
  VR: '/vr',
  PREFERENCES: '/preferences',
  GAMIFICATION: '/gamification',
  SOCIAL_COCON: '/social-cocon',

  // FONCTIONNALITÉS ADMIN UNIQUEMENT - CHEMINS UNIQUES
  TEAMS: '/teams',
  REPORTS: '/reports',
  EVENTS: '/events',
  OPTIMISATION: '/optimisation',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  SECURITY: '/security',
  PRIVACY: '/privacy',
  AUDIT: '/audit',
} as const;

/**
 * Obtient la route de login appropriée selon le rôle
 */
export function getLoginRoute(role: 'b2c' | 'b2b_user' | 'b2b_admin'): string {
  switch (role) {
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_LOGIN;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_LOGIN;
    case 'b2c':
    default:
      return UNIFIED_ROUTES.B2C_LOGIN;
  }
}

/**
 * Obtient la route de dashboard appropriée selon le rôle
 */
export function getDashboardRoute(role: 'b2c' | 'b2b_user' | 'b2b_admin'): string {
  switch (role) {
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_DASHBOARD;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
    case 'b2c':
    default:
      return UNIFIED_ROUTES.B2C_DASHBOARD;
  }
}

/**
 * Vérifie si une route est valide (uniquement routes unifiées)
 */
export function isValidRoute(path: string): boolean {
  const validRoutes = Object.values(UNIFIED_ROUTES);
  return validRoutes.includes(path as any);
}

/**
 * Redirige vers la route appropriée selon le contexte utilisateur
 */
export function getContextualRedirect(userRole?: string): string {
  if (!userRole) {
    return UNIFIED_ROUTES.CHOOSE_MODE;
  }
  
  return getDashboardRoute(userRole as any);
}

/**
 * Obtient le chemin unique pour une fonctionnalité donnée
 */
export function getFeatureRoute(feature: keyof typeof UNIFIED_ROUTES): string {
  return UNIFIED_ROUTES[feature];
}

/**
 * Validation stricte - aucun doublon autorisé
 */
export function validateUniqueRoutes(): boolean {
  const routes = Object.values(UNIFIED_ROUTES);
  const uniqueRoutes = new Set(routes);
  
  if (routes.length !== uniqueRoutes.size) {
    console.error('ERREUR CRITIQUE: Des doublons de routes ont été détectés!');
    return false;
  }
  
  return true;
}

// Validation automatique au chargement
if (!validateUniqueRoutes()) {
  throw new Error('Configuration de routes invalide: doublons détectés');
}
