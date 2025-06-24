/**
 * Utilitaires pour la gestion des routes - VERSION UNIFIÉE COMPLÈTE 52 ROUTES
 * RÈGLE ABSOLUE : Chaque fonctionnalité a UN SEUL chemin d'accès unique
 */

// Routes principales - CHEMINS UNIQUES ABSOLUS - CANON DES 52 ROUTES
export const UNIFIED_ROUTES = {
  // Routes publiques (4)
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  ONBOARDING: '/onboarding',
  B2B_SELECTION: '/b2b/selection',
  
  // Routes d'authentification B2C (2)
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  
  // Routes d'authentification B2B (4)
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2B: '/b2b',
  
  // Routes de dashboards (3)
  B2C_DASHBOARD: '/b2c/dashboard',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',

  // FONCTIONNALITÉS COMMUNES (9)
  SCAN: '/scan',
  MUSIC: '/music',
  COACH: '/coach',
  JOURNAL: '/journal',
  VR: '/vr',
  PREFERENCES: '/preferences',
  GAMIFICATION: '/gamification',
  SOCIAL_COCON: '/social-cocon',

  // MODULES ÉMOTIONNELS AVANCÉS (10)
  BOSS_LEVEL_GRIT: '/boss-level-grit',
  MOOD_MIXER: '/mood-mixer',
  AMBITION_ARCADE: '/ambition-arcade',
  BOUNCE_BACK_BATTLE: '/bounce-back-battle',
  STORY_SYNTH_LAB: '/story-synth-lab',
  FLASH_GLOW: '/flash-glow',
  AR_FILTERS: '/ar-filters',
  BUBBLE_BEAT: '/bubble-beat',
  SCREEN_SILK_BREAK: '/screen-silk-break',
  VR_GALACTIQUE: '/vr-galactique',

  // ANALYTICS AVANCÉS (4)
  INSTANT_GLOW: '/instant-glow',
  WEEKLY_BARS: '/weekly-bars',
  HEATMAP_VIBES: '/heatmap-vibes',
  BREATHWORK: '/breathwork',

  // FONCTIONNALITÉS SPÉCIALISÉES (7)
  PRIVACY_TOGGLES: '/privacy-toggles',
  EXPORT_CSV: '/export-csv',
  ACCOUNT_DELETE: '/account/delete',
  HEALTH_CHECK_BADGE: '/health-check-badge',
  HELP_CENTER: '/help-center',
  PROFILE_SETTINGS: '/profile-settings',
  ACTIVITY_HISTORY: '/activity-history',

  // FONCTIONNALITÉS ADMIN (9)
  TEAMS: '/teams',
  REPORTS: '/reports',
  EVENTS: '/events',
  OPTIMISATION: '/optimisation',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  SECURITY: '/security',
  AUDIT: '/audit',
  ACCESSIBILITY: '/accessibility',
  
  // POINT 20 - FEEDBACK ET AMÉLIORATION CONTINUE (1)
  FEEDBACK: '/feedback',
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
 * VÉRIFIE LES 52 ROUTES OFFICIELLES
 */
export function validateUniqueRoutes(): boolean {
  const routes = Object.values(UNIFIED_ROUTES);
  const uniqueRoutes = new Set(routes);
  
  if (routes.length !== uniqueRoutes.size) {
    console.error('ERREUR CRITIQUE: Des doublons de routes ont été détectés!');
    return false;
  }
  
  // Vérification que nous avons exactement 52 routes
  if (routes.length !== 52) {
    console.error(`ERREUR: Nombre de routes incorrect. Attendu: 52, Actuel: ${routes.length}`);
    return false;
  }
  
  return true;
}

// Validation automatique au chargement
if (!validateUniqueRoutes()) {
  throw new Error('Configuration de routes invalide: 52 routes uniques requises');
}
