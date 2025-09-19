/**
 * Routes helpers - source unique alignée sur RouterV2
 */

import { ROUTES_REGISTRY } from '@/routerV2/registry';

const routeLookup = new Map<string, string>();

ROUTES_REGISTRY.forEach(route => {
  routeLookup.set(route.name, route.path);
});

function resolveRoutePath(name: string, fallback?: string): string {
  const path = routeLookup.get(name);

  if (path) {
    return path;
  }

  if (fallback) {
    return fallback;
  }

  if (typeof console !== 'undefined') {
    console.error(`[routerV2] Route inconnue: "${name}"`);
  }

  return '/';
}

const loginPath = resolveRoutePath('login');
const signupPath = resolveRoutePath('signup');

export const publicRoutes = {
  home: () => resolveRoutePath('home'),
  about: () => resolveRoutePath('about'),
  contact: () => resolveRoutePath('contact'),
  help: () => resolveRoutePath('help'),
  demo: () => resolveRoutePath('demo'),
  onboarding: () => resolveRoutePath('onboarding'),
  privacy: () => resolveRoutePath('privacy'),
  terms: () => resolveRoutePath('legal-terms'),
  legal: () => resolveRoutePath('legal-terms'),
  cookies: () => resolveRoutePath('legal-privacy'),
  services: () => resolveRoutePath('about'),
  testimonials: () => resolveRoutePath('about'),
  blog: () => resolveRoutePath('help'),
  b2cLanding: () => resolveRoutePath('b2c-landing'),
  b2bLanding: () => resolveRoutePath('b2b-landing'),
} as const;

export const authRoutes = {
  login: () => loginPath,
  signup: () => signupPath,
  b2cLogin: () => `${loginPath}?segment=b2c`,
  b2cRegister: () => `${signupPath}?segment=b2c`,
  b2bUserLogin: () => `${loginPath}?segment=b2b&mode=user`,
  b2bAdminLogin: () => `${loginPath}?segment=b2b&mode=admin`,
  forgotPassword: () => `${loginPath}?view=forgot-password`,
  resetPassword: () => `${loginPath}?view=reset-password`,
  verifyEmail: () => `${loginPath}?view=verify-email`,
} as const;

export const b2cRoutes = {
  home: () => resolveRoutePath('b2c-landing'),
  dashboard: () => resolveRoutePath('consumer-home'),
  scan: () => resolveRoutePath('scan'),
  music: () => resolveRoutePath('music'),
  musicPremium: () => resolveRoutePath('music-premium'),
  coach: () => resolveRoutePath('coach'),
  coachMicro: () => resolveRoutePath('coach-micro'),
  journal: () => resolveRoutePath('journal'),
  journalNew: () => resolveRoutePath('journal-new'),
  breath: () => resolveRoutePath('breath'),
  vr: () => resolveRoutePath('vr'),
  vrGalaxy: () => resolveRoutePath('vr-galaxy'),
  vrBreath: () => resolveRoutePath('vr-breath'),
  flashGlow: () => resolveRoutePath('flash-glow'),
  flashGlowUltra: () => resolveRoutePath('flash-glow'),
  breathwork: () => resolveRoutePath('breath'),
  arFilters: () => resolveRoutePath('face-ar'),
  bubbleBeat: () => resolveRoutePath('bubble-beat'),
  moodMixer: () => resolveRoutePath('mood-mixer'),
  bossLevel: () => resolveRoutePath('boss-grit'),
  bounceBack: () => resolveRoutePath('bounce-back'),
  bounceBackBattle: () => resolveRoutePath('bounce-back'),
  storySynth: () => resolveRoutePath('story-synth'),
  community: () => resolveRoutePath('social-cocon-b2c'),
  socialCocon: () => resolveRoutePath('social-cocon-b2c'),
  settings: () => resolveRoutePath('settings-general'),
  profile: () => resolveRoutePath('settings-profile'),
  profileSettings: () => resolveRoutePath('settings-profile'),
  notifications: () => resolveRoutePath('settings-notifications'),
  preferences: () => resolveRoutePath('settings-privacy'),
  activity: () => resolveRoutePath('activity'),
  heatmap: () => resolveRoutePath('heatmap'),
  leaderboard: () => resolveRoutePath('leaderboard'),
  gamification: () => resolveRoutePath('gamification'),
  emotions: () => resolveRoutePath('scan'),
  meditation: () => resolveRoutePath('breath'),
  feedback: () => resolveRoutePath('help'),
  accountDelete: () => resolveRoutePath('settings-privacy'),
} as const;

export const consumerRoutes = {
  home: () => resolveRoutePath('consumer-home'),
  dashboard: () => resolveRoutePath('consumer-home'),
  scan: () => resolveRoutePath('scan'),
  music: () => resolveRoutePath('music'),
  musicPremium: () => resolveRoutePath('music-premium'),
  coach: () => resolveRoutePath('coach'),
  coachMicro: () => resolveRoutePath('coach-micro'),
  journal: () => resolveRoutePath('journal'),
  journalNew: () => resolveRoutePath('journal-new'),
  vr: () => resolveRoutePath('vr'),
  vrGalaxy: () => resolveRoutePath('vr-galaxy'),
  vrBreath: () => resolveRoutePath('vr-breath'),
  flashGlow: () => resolveRoutePath('flash-glow'),
  moodMixer: () => resolveRoutePath('mood-mixer'),
  bossLevel: () => resolveRoutePath('boss-grit'),
  bounceBack: () => resolveRoutePath('bounce-back'),
  storySynth: () => resolveRoutePath('story-synth'),
  activity: () => resolveRoutePath('activity'),
  heatmap: () => resolveRoutePath('heatmap'),
  leaderboard: () => resolveRoutePath('leaderboard'),
  gamification: () => resolveRoutePath('gamification'),
  socialCocon: () => resolveRoutePath('social-cocon-b2c'),
  community: () => resolveRoutePath('social-cocon-b2c'),
  preferences: () => resolveRoutePath('settings-privacy'),
  notifications: () => resolveRoutePath('settings-notifications'),
  settings: () => resolveRoutePath('settings-general'),
  profile: () => resolveRoutePath('settings-profile'),
} as const;

export const b2bRoutes = {
  home: () => resolveRoutePath('b2b-landing'),
  teams: () => resolveRoutePath('teams'),
  reports: () => resolveRoutePath('admin-reports'),
  events: () => resolveRoutePath('admin-events'),
  socialCocon: () => resolveRoutePath('social-cocon-b2b'),
  optimization: () => resolveRoutePath('admin-optimization'),
  security: () => resolveRoutePath('admin-security'),
  audit: () => resolveRoutePath('admin-audit'),
  accessibility: () => resolveRoutePath('admin-accessibility'),
  user: {
    dashboard: () => resolveRoutePath('employee-home'),
  },
  admin: {
    dashboard: () => resolveRoutePath('manager-home'),
    analytics: () => resolveRoutePath('admin-optimization'),
    settings: () => resolveRoutePath('admin-security'),
  },
} as const;

export const specialRoutes = {
  chooseMode: () => resolveRoutePath('choose-mode'),
  appGate: () => resolveRoutePath('app-gate'),
  unauthorized: () => resolveRoutePath('unauthorized'),
  forbidden: () => resolveRoutePath('forbidden'),
  notFound: () => resolveRoutePath('not-found'),
  serverError: () => resolveRoutePath('server-error'),
} as const;

export const routes = {
  public: publicRoutes,
  auth: authRoutes,
  b2c: b2cRoutes,
  consumer: consumerRoutes,
  b2b: b2bRoutes,
  special: specialRoutes,
} as const;

export type PublicRoute = keyof typeof publicRoutes;
export type AuthRoute = keyof typeof authRoutes;
export type B2CRoute = keyof typeof b2cRoutes;
export type ConsumerRoute = keyof typeof consumerRoutes;
export type B2BRoute = keyof typeof b2bRoutes;
export type SpecialRoute = keyof typeof specialRoutes;
