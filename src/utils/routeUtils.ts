
// Routes unifiées - TICKET FE-FINAL-ROUTE-COMPLETION (52 routes officielles)
export const UNIFIED_ROUTES = {
  // Routes publiques (8)
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  ONBOARDING: '/onboarding',
  B2B_SELECTION: '/b2b/selection',
  AUTH: '/auth',
  PRICING: '/pricing',
  CONTACT: '/contact',
  ABOUT: '/about',
  
  // Routes d'authentification (6)
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2B: '/b2b',
  
  // Dashboards (3)
  B2C_DASHBOARD: '/b2c/dashboard',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',
  
  // Fonctionnalités principales (8)
  SCAN: '/scan',
  MUSIC: '/music',
  COACH: '/coach',
  JOURNAL: '/journal',
  VR: '/vr',
  PREFERENCES: '/preferences',
  GAMIFICATION: '/gamification',
  SOCIAL_COCON: '/social-cocon',
  
  // Modules fun-first avec IA (11)
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
  INSTANT_GLOW: '/instant-glow',
  
  // Analytics & data (3)
  WEEKLY_BARS: '/weekly-bars',
  HEATMAP_VIBES: '/heatmap-vibes',
  BREATHWORK: '/breathwork',
  
  // Paramètres & compte (7)
  PRIVACY_TOGGLES: '/privacy-toggles',
  EXPORT_CSV: '/export-csv',
  ACCOUNT_DELETE: '/account/delete',
  HEALTH_CHECK_BADGE: '/health-check-badge',
  NOTIFICATIONS: '/notifications',
  HELP_CENTER: '/help-center',
  PROFILE_SETTINGS: '/profile-settings',
  
  // Historique & feedback (2)
  ACTIVITY_HISTORY: '/activity-history',
  FEEDBACK: '/feedback',
  
  // Administration B2B (8)
  TEAMS: '/teams',
  REPORTS: '/reports',
  EVENTS: '/events',
  OPTIMISATION: '/optimisation',
  SETTINGS: '/settings',
  SECURITY: '/security',
  AUDIT: '/audit',
  ACCESSIBILITY: '/accessibility'
} as const;

export type UnifiedRoute = typeof UNIFIED_ROUTES[keyof typeof UNIFIED_ROUTES];

export const getLoginRoute = (userType: string): string => {
  switch (userType) {
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

export const getDashboardRoute = (userType: string): string => {
  switch (userType) {
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
    SCAN: UNIFIED_ROUTES.SCAN,
    MUSIC: UNIFIED_ROUTES.MUSIC,
    COACH: UNIFIED_ROUTES.COACH,
    JOURNAL: UNIFIED_ROUTES.JOURNAL,
    VR: UNIFIED_ROUTES.VR,
    SETTINGS: UNIFIED_ROUTES.SETTINGS,
    PREFERENCES: UNIFIED_ROUTES.PREFERENCES,
    GAMIFICATION: UNIFIED_ROUTES.GAMIFICATION,
    SOCIAL_COCON: UNIFIED_ROUTES.SOCIAL_COCON
  };
  
  return featureRoutes[feature] || UNIFIED_ROUTES.HOME;
};

export const getContextualRedirect = (userMode?: string): string => {
  if (!userMode) {
    return UNIFIED_ROUTES.CHOOSE_MODE;
  }
  
  return getDashboardRoute(userMode);
};

export const isValidRoute = (route: string): boolean => {
  return Object.values(UNIFIED_ROUTES).includes(route as UnifiedRoute);
};

// Validation automatique de l'unicité des routes
export const validateUniqueRoutes = (): boolean => {
  const routes = Object.values(UNIFIED_ROUTES);
  const uniqueRoutes = new Set(routes);
  
  if (routes.length !== uniqueRoutes.size) {
    console.error('🚨 ERREUR CRITIQUE: Doublons de routes détectés!');
    console.error('Routes en doublon:', routes.filter((route, index) => routes.indexOf(route) !== index));
    return false;
  }
  
  console.log('✅ Toutes les routes sont uniques:', routes.length, 'routes validées');
  return true;
};

// Validation au démarrage
if (process.env.NODE_ENV === 'development') {
  if (!validateUniqueRoutes()) {
    throw new Error('ERREUR CRITIQUE: Architecture de routage compromise - doublons détectés');
  }
}
