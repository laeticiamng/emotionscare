/**
 * Routes helpers pour RouterV2
 * Helpers typés pour générer les URLs des routes
 */

// ═══════════════════════════════════════════════════════════
// HELPERS DE ROUTES PUBLIQUES
// ═══════════════════════════════════════════════════════════

export const publicRoutes = {
  home: () => '/',
  about: () => '/about',
  contact: () => '/contact',
  privacy: () => '/privacy',
  terms: () => '/terms',
  legal: () => '/legal',
  cookies: () => '/cookies',
  services: () => '/services',
  testimonials: () => '/testimonials',
  blog: () => '/blog',
  help: () => '/help',
} as const;

// ═══════════════════════════════════════════════════════════
// HELPERS DE ROUTES D'AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════

export const authRoutes = {
  login: () => '/login',
  signup: () => '/signup',
  b2cLogin: () => '/b2c/login',
  b2cRegister: () => '/b2c/register',
  b2bUserLogin: () => '/b2b/user/login',
  b2bAdminLogin: () => '/b2b/admin/login',
  forgotPassword: () => '/forgot-password',
  resetPassword: () => '/reset-password',
  verifyEmail: () => '/verify-email',
} as const;

// ═══════════════════════════════════════════════════════════
// HELPERS DE ROUTES B2C
// ═══════════════════════════════════════════════════════════

export const b2cRoutes = {
  home: () => '/b2c',
  dashboard: () => '/app/home',
  scan: () => '/app/scan',
  music: () => '/app/music',
  coach: () => '/app/coach',
  journal: () => '/app/journal',
  breath: () => '/app/breath',
  flashGlow: () => '/app/flash-glow',
  moodMixer: () => '/app/mood-mixer',
  vr: () => '/app/vr',
  meditation: () => '/meditation',
  emotions: () => '/app/emotions',
  community: () => '/app/community',
  settings: () => '/settings',
  profile: () => '/profile',
  
  // Modules Fun-First
  flashGlow: () => '/app/flash-glow',
  breathwork: () => '/app/breathwork',
  arFilters: () => '/app/ar-filters',
  bubbleBeat: () => '/app/bubble-beat',
  moodMixer: () => '/app/mood-mixer',
  bossLevel: () => '/app/boss-level-grit',
  
  // Autres pages B2C
  notifications: () => '/notifications',
  feedback: () => '/feedback',
  activity: () => '/activity-history',
  accountDelete: () => '/account/delete',
  profileSettings: () => '/profile/settings',
} as const;

// ═══════════════════════════════════════════════════════════
// HELPERS DE ROUTES B2B
// ═══════════════════════════════════════════════════════════

export const b2bRoutes = {
  home: () => '/b2b',
  teams: () => '/teams',
  reports: () => '/reports',
  events: () => '/events',
  socialCocon: () => '/social-cocon',
  
  user: {
    dashboard: () => '/b2b/user/dashboard',
    profile: () => '/b2b/user/profile',
    settings: () => '/b2b/user/settings',
  },
  
  admin: {
    dashboard: () => '/b2b/admin/dashboard',
    users: () => '/b2b/admin/users',
    analytics: () => '/b2b/admin/analytics',
    settings: () => '/b2b/admin/settings',
  },
} as const;

// ═══════════════════════════════════════════════════════════
// HELPERS DE ROUTES SPÉCIALES
// ═══════════════════════════════════════════════════════════

export const specialRoutes = {
  chooseMode: () => '/choose-mode',
  appGate: () => '/app-gate',
  unauthorized: () => '/unauthorized',
  forbidden: () => '/forbidden',
  notFound: () => '/404',
  serverError: () => '/500',
} as const;

// ═══════════════════════════════════════════════════════════
// OBJET ROUTES PRINCIPAL
// ═══════════════════════════════════════════════════════════

export const routes = {
  public: publicRoutes,
  auth: authRoutes,
  b2c: b2cRoutes,
  b2b: b2bRoutes,
  special: specialRoutes,
} as const;

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type PublicRoute = keyof typeof publicRoutes;
export type AuthRoute = keyof typeof authRoutes;
export type B2CRoute = keyof typeof b2cRoutes;
export type B2BRoute = keyof typeof b2bRoutes;
export type SpecialRoute = keyof typeof specialRoutes;