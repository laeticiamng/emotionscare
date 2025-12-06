// @ts-nocheck
import {
  publicRoutes,
  authRoutes,
  b2cRoutes,
  consumerRoutes,
  b2bRoutes,
  specialRoutes,
  routes,
  type PublicRoute,
  type AuthRoute,
  type B2CRoute,
  type ConsumerRoute,
  type B2BRoute,
  type SpecialRoute,
} from '@/lib/routes';

/**
 * Compatibilité historique : expose l'ancien helper `Routes.xxx()`
 * tout en s'appuyant sur la nouvelle source unique `lib/routes`.
 */
type LoginOptions = {
  segment?: 'b2c' | 'b2b';
  mode?: 'user' | 'admin';
};

type SignupOptions = {
  segment?: 'b2c' | 'b2b';
};

const resolveB2BLogin = (mode?: 'user' | 'admin') =>
  mode === 'admin' ? authRoutes.b2bAdminLogin() : authRoutes.b2bUserLogin();

const login = (options?: LoginOptions) => {
  if (!options?.segment) {
    return authRoutes.login();
  }

  if (options.segment === 'b2c') {
    return authRoutes.b2cLogin();
  }

  return resolveB2BLogin(options.mode);
};

const signup = (options?: SignupOptions) => {
  if (options?.segment === 'b2c') {
    return authRoutes.b2cRegister();
  }

  return authRoutes.signup();
};

export const Routes = {
  // Public marketing
  home: () => publicRoutes.home(),
  b2c: () => publicRoutes.b2cLanding(),
  enterprise: () => publicRoutes.b2bLanding(),
  chooseMode: () => specialRoutes.chooseMode(),

  // Auth helpers
  login,
  signup,

  // Entrée application
  app: () => specialRoutes.appGate(),

  // Dashboards & modes
  consumerHome: () => consumerRoutes.home(),
  employeeHome: () => b2bRoutes.user.dashboard(),
  managerHome: () => b2bRoutes.admin.dashboard(),

  // Modules B2C / Consumer
  scan: () => consumerRoutes.scan(),
  music: () => consumerRoutes.music(),
  musicPremium: () => consumerRoutes.musicPremium(),
  coach: () => consumerRoutes.coach(),
  coachMicro: () => consumerRoutes.coachMicro(),
  journal: () => consumerRoutes.journal(),
  journalNew: () => consumerRoutes.journalNew(),
  breath: () => b2cRoutes.breath(),
  vr: () => consumerRoutes.vr(),
  vrGalaxy: () => consumerRoutes.vrGalaxy(),
  vrBreath: () => consumerRoutes.vrBreath(),
  flashGlow: () => b2cRoutes.flashGlow(),
  flashGlowUltra: () => b2cRoutes.flashGlowUltra(),
  breathwork: () => b2cRoutes.breathwork(),
  arFilters: () => b2cRoutes.arFilters(),
  bubbleBeat: () => b2cRoutes.bubbleBeat(),
  moodMixer: () => b2cRoutes.moodMixer(),
  bossGrit: () => b2cRoutes.bossLevel(),
  bounceBack: () => b2cRoutes.bounceBack(),
  storySynth: () => b2cRoutes.storySynth(),
  community: () => b2cRoutes.community(),
  exchange: () => b2cRoutes.exchange(),
  socialCocon: () => b2cRoutes.socialCocon(),
  activity: () => b2cRoutes.activity(),
  heatmap: () => b2cRoutes.heatmap(),
  leaderboard: () => b2cRoutes.leaderboard(),
  gamification: () => b2cRoutes.gamification(),

  // Paramètres B2C
  settingsGeneral: () => b2cRoutes.settings(),
  settingsProfile: () => b2cRoutes.profile(),
  settingsPrivacy: () => b2cRoutes.preferences(),
  settingsNotifications: () => b2cRoutes.notifications(),

  // B2B
  teams: () => b2bRoutes.teams(),
  adminReports: () => b2bRoutes.reports(),
  adminEvents: () => b2bRoutes.events(),
  adminOptimization: () => b2bRoutes.optimization(),
  adminSecurity: () => b2bRoutes.security(),
  adminAudit: () => b2bRoutes.audit(),
  adminAccessibility: () => b2bRoutes.accessibility(),

  // Pages système
  unauthorized: () => specialRoutes.unauthorized(),
  forbidden: () => specialRoutes.forbidden(),
  notFound: () => specialRoutes.notFound(),
  serverError: () => specialRoutes.serverError(),
} as const;

export {
  publicRoutes,
  authRoutes,
  b2cRoutes,
  consumerRoutes,
  b2bRoutes,
  specialRoutes,
  routes,
};

export type {
  PublicRoute,
  AuthRoute,
  B2CRoute,
  ConsumerRoute,
  B2BRoute,
  SpecialRoute,
};

export type RoutesCompat = typeof Routes;
