/**
 * RouterV2 Helpers - Functions typées pour la navigation
 * TICKET: FE/BE-Router-Cleanup-01
 * 
 * USAGE: 
 * - Remplace tous les liens en dur <Link to="/..."> 
 * - Utilise Routes.music() au lieu de "/music"
 * - Permet les paramètres typés
 */

export const Routes = {
  // ═══════════════════════════════════════════════════════════
  // ROUTES PUBLIQUES
  // ═══════════════════════════════════════════════════════════
  home: () => '/',
  b2cLanding: () => '/b2c',
  b2bLanding: () => '/entreprise',
  
  login: (params?: { segment?: 'b2c' | 'b2b' }) => {
    const base = '/login';
    return params?.segment ? `${base}?segment=${params.segment}` : base;
  },
  
  signup: (params?: { segment?: 'b2c' | 'b2b' }) => {
    const base = '/signup';
    return params?.segment ? `${base}?segment=${params.segment}` : base;
  },
  
  about: () => '/about',
  contact: () => '/contact',
  help: () => '/help',
  demo: () => '/demo',
  onboarding: () => '/onboarding',
  privacy: () => '/privacy',

  // ═══════════════════════════════════════════════════════════
  // APP & DASHBOARDS
  // ═══════════════════════════════════════════════════════════
  app: () => '/app',
  consumerHome: () => '/app/home',
  employeeHome: () => '/app/collab',
  managerHome: () => '/app/rh',

  // ═══════════════════════════════════════════════════════════
  // MODULES FONCTIONNELS
  // ═══════════════════════════════════════════════════════════
  scan: () => '/app/scan',
  music: () => '/app/music',
  coach: () => '/app/coach',
  journal: () => '/app/journal',
  vr: () => '/app/vr',

  // ═══════════════════════════════════════════════════════════
  // MODULES FUN-FIRST
  // ═══════════════════════════════════════════════════════════
  flashGlow: () => '/app/flash-glow',
  breath: () => '/app/breath',
  faceAR: () => '/app/face-ar',
  emotionScan: () => '/app/emotion-scan',
  voiceJournal: () => '/app/voice-journal',
  bubbleBeat: () => '/app/bubble-beat',
  screenSilk: () => '/app/screen-silk',
  vrGalaxy: () => '/app/vr-galaxy',
  bossGrit: () => '/app/boss-grit',
  moodMixer: () => '/app/mood-mixer',
  ambitionArcade: () => '/app/ambition-arcade',
  bounceBack: () => '/app/bounce-back',
  storySynth: () => '/app/story-synth',
  emotions: () => '/app/emotions',
  community: () => '/app/community',
  socialCoconB2C: () => '/app/social-cocon',

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & DATA
  // ═══════════════════════════════════════════════════════════
  leaderboard: () => '/app/leaderboard',
  activity: () => '/app/activity',
  heatmap: () => '/app/heatmap',

  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  settingsGeneral: () => '/settings/general',
  settingsProfile: () => '/settings/profile',
  settingsPrivacy: () => '/settings/privacy',
  settingsNotifications: () => '/settings/notifications',
  settingsDataPrivacy: () => '/settings/data-privacy',

  // ═══════════════════════════════════════════════════════════
  // B2B FEATURES
  // ═══════════════════════════════════════════════════════════
  teams: () => '/app/teams',
  socialCoconB2B: () => '/app/social',
  b2bSelection: () => '/b2b/selection',
  b2bLandingDetailed: () => '/b2b/landing',

  // ═══════════════════════════════════════════════════════════
  // B2B ADMIN
  // ═══════════════════════════════════════════════════════════
  adminReports: () => '/app/reports',
  adminEvents: () => '/app/events',
  adminOptimization: () => '/app/optimization',
  adminSecurity: () => '/app/security',
  adminAudit: () => '/app/audit',
  adminAccessibility: () => '/app/accessibility',
  apiMonitoring: () => '/system/api-monitoring',

  // ═══════════════════════════════════════════════════════════
  // NAVIGATION & SYSTEM
  // ═══════════════════════════════════════════════════════════
  navigation: () => '/navigation',
  featureMatrix: () => '/feature-matrix',

  // ═══════════════════════════════════════════════════════════
  // PAGES SYSTÈME
  // ═══════════════════════════════════════════════════════════
  unauthorized: () => '/401',
  forbidden: () => '/403',
  notFound: () => '/404',
  serverError: () => '/503',
} as const;

// ═══════════════════════════════════════════════════════════
// HELPERS DYNAMIQUES
// ═══════════════════════════════════════════════════════════

/**
 * Retourne le dashboard approprié selon le rôle utilisateur
 */
export function getDashboardRoute(role?: string): string {
  switch (role) {
    case 'consumer':
    case 'b2c':
      return Routes.consumerHome();
    case 'employee':
    case 'b2b_user':
      return Routes.employeeHome();
    case 'manager':
    case 'b2b_admin':
      return Routes.managerHome();
    default:
      return Routes.app();
  }
}

/**
 * Retourne la route de login appropriée selon le segment
 */
export function getLoginRoute(segment?: 'b2c' | 'b2b'): string {
  return Routes.login({ segment });
}

/**
 * Retourne la route de signup appropriée selon le segment
 */
export function getSignupRoute(segment?: 'b2c' | 'b2b'): string {
  return Routes.signup({ segment });
}

/**
 * Type helper pour garantir que toutes les routes sont des strings
 */
export type RouteFunction = () => string;
export type ParameterizedRouteFunction<T = any> = (params?: T) => string;