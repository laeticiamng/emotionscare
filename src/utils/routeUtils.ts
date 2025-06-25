
// Utilitaires de routage unifié pour EmotionsCare
// Point 14 : Architecture unifiée des routes

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

// Routes unifiées - TOUTES LES 52 ROUTES MAINTENANT DISPONIBLES
export const UNIFIED_ROUTES = {
  // Pages d'accueil et navigation
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  B2B_SELECTION: '/b2b/selection',
  ONBOARDING: '/onboarding',
  
  // Authentification B2C
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  
  // Authentification B2B
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  
  // Dashboards
  B2C_DASHBOARD: '/b2c/dashboard',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',
  B2B_LANDING: '/b2b',
  
  // Modules fonctionnels principaux
  SCAN: '/scan',
  MUSIC: '/music',
  COACH: '/coach',
  JOURNAL: '/journal',
  VR: '/vr',
  GAMIFICATION: '/gamification',
  SOCIAL_COCON: '/social-cocon',
  
  // Bloc Résilience & rebond (8 nouvelles pages)
  BOSS_LEVEL_GRIT: '/boss-level-grit',
  MOOD_MIXER: '/mood-mixer',
  BOUNCE_BACK_BATTLE: '/bounce-back-battle',
  STORY_SYNTH_LAB: '/story-synth-lab',
  BREATHWORK: '/breathwork',
  VR_GALACTIQUE: '/vr-galactique',
  SCREEN_SILK_BREAK: '/screen-silk-break',
  FLASH_GLOW: '/flash-glow',
  
  // Ambition & motivation
  AMBITION_ARCADE: '/ambition-arcade',
  
  // Bio-feedback & mesure (5 nouvelles pages)
  AR_FILTERS: '/ar-filters',
  BUBBLE_BEAT: '/bubble-beat',
  INSTANT_GLOW: '/instant-glow',
  WEEKLY_BARS: '/weekly-bars',
  HEATMAP_VIBES: '/heatmap-vibes',
  
  // Profil & préférences (3 nouvelles pages)
  PREFERENCES: '/preferences',
  PROFILE_SETTINGS: '/profile-settings',
  ACTIVITY_HISTORY: '/activity-history',
  
  // Confidentialité & données (3 nouvelles pages)
  PRIVACY_TOGGLES: '/privacy-toggles',
  EXPORT_CSV: '/export-csv',
  ACCOUNT_DELETE: '/account/delete',
  
  // Support & notifications (3 nouvelles pages)
  NOTIFICATIONS: '/notifications',
  HELP_CENTER: '/help-center',
  FEEDBACK: '/feedback',
  
  // Administration B2B
  TEAMS: '/teams',
  REPORTS: '/reports',
  EVENTS: '/events',
  OPTIMISATION: '/optimisation',
  SETTINGS: '/settings',
  
  // Administration avancée (5 nouvelles pages)
  SECURITY: '/security',
  AUDIT: '/audit',
  ACCESSIBILITY: '/accessibility',
  HEALTH_CHECK_BADGE: '/health-check-badge'
} as const;

// Validation de l'unicité des routes (Point 14)
export const validateUniqueRoutes = (): boolean => {
  const routes = Object.values(UNIFIED_ROUTES);
  const uniqueRoutes = new Set(routes);
  return routes.length === uniqueRoutes.size;
};

// Fonctions utilitaires pour la navigation
export const getLoginRoute = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return UNIFIED_ROUTES.B2C_LOGIN;
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_LOGIN;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_LOGIN;
    default:
      return UNIFIED_ROUTES.CHOOSE_MODE;
  }
};

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return UNIFIED_ROUTES.B2C_DASHBOARD;
    case 'b2b_user':
      return UNIFIED_ROUTES.B2B_USER_DASHBOARD;
    case 'b2b_admin':
      return UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
    default:
      return UNIFIED_ROUTES.HOME;
  }
};

export const getFeatureRoute = (feature: string): string => {
  const featureRoutes: Record<string, string> = {
    'SCAN': UNIFIED_ROUTES.SCAN,
    'MUSIC': UNIFIED_ROUTES.MUSIC,
    'COACH': UNIFIED_ROUTES.COACH,
    'JOURNAL': UNIFIED_ROUTES.JOURNAL,
    'VR': UNIFIED_ROUTES.VR,
    'PREFERENCES': UNIFIED_ROUTES.PREFERENCES,
    'GAMIFICATION': UNIFIED_ROUTES.GAMIFICATION,
    'SOCIAL_COCON': UNIFIED_ROUTES.SOCIAL_COCON,
    'TEAMS': UNIFIED_ROUTES.TEAMS,
    'REPORTS': UNIFIED_ROUTES.REPORTS,
    'EVENTS': UNIFIED_ROUTES.EVENTS,
    'OPTIMISATION': UNIFIED_ROUTES.OPTIMISATION,
    'SETTINGS': UNIFIED_ROUTES.SETTINGS,
    'BOSS_LEVEL_GRIT': UNIFIED_ROUTES.BOSS_LEVEL_GRIT,
    'MOOD_MIXER': UNIFIED_ROUTES.MOOD_MIXER,
    'BOUNCE_BACK_BATTLE': UNIFIED_ROUTES.BOUNCE_BACK_BATTLE,
    'STORY_SYNTH_LAB': UNIFIED_ROUTES.STORY_SYNTH_LAB,
    'BREATHWORK': UNIFIED_ROUTES.BREATHWORK,
    'VR_GALACTIQUE': UNIFIED_ROUTES.VR_GALACTIQUE,
    'SCREEN_SILK_BREAK': UNIFIED_ROUTES.SCREEN_SILK_BREAK,
    'FLASH_GLOW': UNIFIED_ROUTES.FLASH_GLOW,
    'AMBITION_ARCADE': UNIFIED_ROUTES.AMBITION_ARCADE,
    'AR_FILTERS': UNIFIED_ROUTES.AR_FILTERS,
    'BUBBLE_BEAT': UNIFIED_ROUTES.BUBBLE_BEAT,
    'INSTANT_GLOW': UNIFIED_ROUTES.INSTANT_GLOW,
    'WEEKLY_BARS': UNIFIED_ROUTES.WEEKLY_BARS,
    'HEATMAP_VIBES': UNIFIED_ROUTES.HEATMAP_VIBES,
    'PRIVACY_TOGGLES': UNIFIED_ROUTES.PRIVACY_TOGGLES,
    'EXPORT_CSV': UNIFIED_ROUTES.EXPORT_CSV,
    'ACCOUNT_DELETE': UNIFIED_ROUTES.ACCOUNT_DELETE,
    'NOTIFICATIONS': UNIFIED_ROUTES.NOTIFICATIONS,
    'HELP_CENTER': UNIFIED_ROUTES.HELP_CENTER,
    'FEEDBACK': UNIFIED_ROUTES.FEEDBACK,
    'SECURITY': UNIFIED_ROUTES.SECURITY,
    'AUDIT': UNIFIED_ROUTES.AUDIT,
    'ACCESSIBILITY': UNIFIED_ROUTES.ACCESSIBILITY,
    'HEALTH_CHECK_BADGE': UNIFIED_ROUTES.HEALTH_CHECK_BADGE
  };
  
  return featureRoutes[feature] || UNIFIED_ROUTES.HOME;
};

export const getContextualRedirect = (role?: UserRole): string => {
  if (!role) return UNIFIED_ROUTES.CHOOSE_MODE;
  return getDashboardRoute(role);
};

export const isValidRoute = (path: string): boolean => {
  return Object.values(UNIFIED_ROUTES).includes(path as any);
};

// Export pour les tests
export const TOTAL_ROUTES_COUNT = Object.keys(UNIFIED_ROUTES).length;

console.log(`✅ Routes système unifié : ${TOTAL_ROUTES_COUNT} routes configurées`);
console.log(`✅ Validation unicité : ${validateUniqueRoutes() ? 'PASS' : 'FAIL'}`);
