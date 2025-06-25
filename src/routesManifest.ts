
/**
 * Manifeste officiel des 52 routes EmotionsCare
 * Source unique de vérité pour le routage
 */

export const OFFICIAL_ROUTES = {
  // Routes mesure & adaptation immédiate (8)
  SCAN: '/scan',
  MUSIC: '/music', 
  FLASH_GLOW: '/flash-glow',
  BOSS_LEVEL_GRIT: '/boss-level-grit',
  MOOD_MIXER: '/mood-mixer',
  BOUNCE_BACK_BATTLE: '/bounce-back-battle',
  BREATHWORK: '/breathwork',
  INSTANT_GLOW: '/instant-glow',

  // Routes expériences immersives (6)
  VR: '/vr',
  VR_GALACTIQUE: '/vr-galactique',
  SCREEN_SILK_BREAK: '/screen-silk-break',
  STORY_SYNTH_LAB: '/story-synth-lab',
  AR_FILTERS: '/ar-filters',
  BUBBLE_BEAT: '/bubble-beat',

  // Routes ambition & progression (4)
  AMBITION_ARCADE: '/ambition-arcade',
  GAMIFICATION: '/gamification',
  WEEKLY_BARS: '/weekly-bars',
  HEATMAP_VIBES: '/heatmap-vibes',

  // Routes espaces utilisateur (16)
  HOME: '/',
  CHOOSE_MODE: '/choose-mode',
  ONBOARDING: '/onboarding',
  B2C_LOGIN: '/b2c/login',
  B2C_REGISTER: '/b2c/register',
  B2C_DASHBOARD: '/b2c/dashboard',
  PREFERENCES: '/preferences',
  SOCIAL_COCON: '/social-cocon',
  PROFILE_SETTINGS: '/profile-settings',
  ACTIVITY_HISTORY: '/activity-history',
  NOTIFICATIONS: '/notifications',
  FEEDBACK: '/feedback',
  ACCOUNT_DELETE: '/account/delete',
  EXPORT_CSV: '/export-csv',
  PRIVACY_TOGGLES: '/privacy-toggles',
  HEALTH_CHECK_BADGE: '/health-check-badge',

  // Routes espaces B2B (18)
  B2B: '/b2b',
  B2B_SELECTION: '/b2b/selection',
  B2B_USER_LOGIN: '/b2b/user/login',
  B2B_USER_REGISTER: '/b2b/user/register',
  B2B_USER_DASHBOARD: '/b2b/user/dashboard',
  B2B_ADMIN_LOGIN: '/b2b/admin/login',
  B2B_ADMIN_DASHBOARD: '/b2b/admin/dashboard',
  TEAMS: '/teams',
  REPORTS: '/reports',
  EVENTS: '/events',
  OPTIMISATION: '/optimisation',
  SETTINGS: '/settings',
  SECURITY: '/security',
  AUDIT: '/audit',
  ACCESSIBILITY: '/accessibility',
  INNOVATION: '/innovation',
  HELP_CENTER: '/help-center'
} as const;

export type OfficialRoute = typeof OFFICIAL_ROUTES[keyof typeof OFFICIAL_ROUTES];

// Array pour faciliter les itérations
export const OFFICIAL_ROUTES_ARRAY: OfficialRoute[] = Object.values(OFFICIAL_ROUTES);

// Validation
export const validateRoute = (path: string): path is OfficialRoute => {
  return OFFICIAL_ROUTES_ARRAY.includes(path as OfficialRoute);
};

// Groupement par catégorie
export const ROUTES_BY_CATEGORY = {
  measure_adaptation: [
    OFFICIAL_ROUTES.SCAN,
    OFFICIAL_ROUTES.MUSIC,
    OFFICIAL_ROUTES.FLASH_GLOW,
    OFFICIAL_ROUTES.BOSS_LEVEL_GRIT,
    OFFICIAL_ROUTES.MOOD_MIXER,
    OFFICIAL_ROUTES.BOUNCE_BACK_BATTLE,
    OFFICIAL_ROUTES.BREATHWORK,
    OFFICIAL_ROUTES.INSTANT_GLOW
  ],
  immersive_experiences: [
    OFFICIAL_ROUTES.VR,
    OFFICIAL_ROUTES.VR_GALACTIQUE,
    OFFICIAL_ROUTES.SCREEN_SILK_BREAK,
    OFFICIAL_ROUTES.STORY_SYNTH_LAB,
    OFFICIAL_ROUTES.AR_FILTERS,
    OFFICIAL_ROUTES.BUBBLE_BEAT
  ],
  ambition_progression: [
    OFFICIAL_ROUTES.AMBITION_ARCADE,
    OFFICIAL_ROUTES.GAMIFICATION,
    OFFICIAL_ROUTES.WEEKLY_BARS,
    OFFICIAL_ROUTES.HEATMAP_VIBES
  ],
  user_spaces: [
    OFFICIAL_ROUTES.HOME,
    OFFICIAL_ROUTES.CHOOSE_MODE,
    OFFICIAL_ROUTES.ONBOARDING,
    OFFICIAL_ROUTES.B2C_LOGIN,
    OFFICIAL_ROUTES.B2C_REGISTER,
    OFFICIAL_ROUTES.B2C_DASHBOARD,
    OFFICIAL_ROUTES.PREFERENCES,
    OFFICIAL_ROUTES.SOCIAL_COCON,
    OFFICIAL_ROUTES.PROFILE_SETTINGS,
    OFFICIAL_ROUTES.ACTIVITY_HISTORY,
    OFFICIAL_ROUTES.NOTIFICATIONS,
    OFFICIAL_ROUTES.FEEDBACK,
    OFFICIAL_ROUTES.ACCOUNT_DELETE,
    OFFICIAL_ROUTES.EXPORT_CSV,
    OFFICIAL_ROUTES.PRIVACY_TOGGLES,
    OFFICIAL_ROUTES.HEALTH_CHECK_BADGE
  ],
  b2b_spaces: [
    OFFICIAL_ROUTES.B2B,
    OFFICIAL_ROUTES.B2B_SELECTION,
    OFFICIAL_ROUTES.B2B_USER_LOGIN,
    OFFICIAL_ROUTES.B2B_USER_REGISTER,
    OFFICIAL_ROUTES.B2B_USER_DASHBOARD,
    OFFICIAL_ROUTES.B2B_ADMIN_LOGIN,
    OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD,
    OFFICIAL_ROUTES.TEAMS,
    OFFICIAL_ROUTES.REPORTS,
    OFFICIAL_ROUTES.EVENTS,
    OFFICIAL_ROUTES.OPTIMISATION,
    OFFICIAL_ROUTES.SETTINGS,
    OFFICIAL_ROUTES.SECURITY,
    OFFICIAL_ROUTES.AUDIT,
    OFFICIAL_ROUTES.ACCESSIBILITY,
    OFFICIAL_ROUTES.INNOVATION,
    OFFICIAL_ROUTES.HELP_CENTER
  ]
};

export const TOTAL_ROUTES_COUNT = 52;

// Vérification de cohérence
const actualCount = OFFICIAL_ROUTES_ARRAY.length;
if (actualCount !== TOTAL_ROUTES_COUNT) {
  console.error(`🚨 ERREUR MANIFESTE: ${actualCount} routes définies, ${TOTAL_ROUTES_COUNT} attendues`);
}

console.log(`✅ Manifeste routes: ${actualCount}/${TOTAL_ROUTES_COUNT} routes définies`);
