
import { RouteObject } from 'react-router-dom';
import { unifiedRoutes } from './routes/unifiedRoutes';
import { OFFICIAL_ROUTES } from '@/routesManifest';

// Export de tous les manifestes de routes pour compatibilité
export const ROUTES_MANIFEST = {
  home: OFFICIAL_ROUTES.HOME,
  chooseMode: OFFICIAL_ROUTES.CHOOSE_MODE,
  b2c: OFFICIAL_ROUTES.B2C_LOGIN,
  b2cLogin: OFFICIAL_ROUTES.B2C_LOGIN,
  b2cRegister: OFFICIAL_ROUTES.B2C_REGISTER,
  b2cDashboard: OFFICIAL_ROUTES.B2C_DASHBOARD,
  b2b: OFFICIAL_ROUTES.B2B,
  b2bSelection: OFFICIAL_ROUTES.B2B_SELECTION,
  b2bUserLogin: OFFICIAL_ROUTES.B2B_USER_LOGIN,
  b2bUserRegister: OFFICIAL_ROUTES.B2B_USER_REGISTER,
  b2bUserDashboard: OFFICIAL_ROUTES.B2B_USER_DASHBOARD,
  b2bAdminLogin: OFFICIAL_ROUTES.B2B_ADMIN_LOGIN,
  b2bAdminDashboard: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD,
  scan: OFFICIAL_ROUTES.SCAN,
  music: OFFICIAL_ROUTES.MUSIC,
  flashGlow: OFFICIAL_ROUTES.FLASH_GLOW,
  bossLevelGrit: OFFICIAL_ROUTES.BOSS_LEVEL_GRIT,
  moodMixer: OFFICIAL_ROUTES.MOOD_MIXER,
  bounceBackBattle: OFFICIAL_ROUTES.BOUNCE_BACK_BATTLE,
  breathwork: OFFICIAL_ROUTES.BREATHWORK,
  instantGlow: OFFICIAL_ROUTES.INSTANT_GLOW,
  vr: OFFICIAL_ROUTES.VR,
  vrGalactique: OFFICIAL_ROUTES.VR_GALACTIQUE,
  screenSilkBreak: OFFICIAL_ROUTES.SCREEN_SILK_BREAK,
  storySynthLab: OFFICIAL_ROUTES.STORY_SYNTH_LAB,
  arFilters: OFFICIAL_ROUTES.AR_FILTERS,
  bubbleBeat: OFFICIAL_ROUTES.BUBBLE_BEAT,
  ambitionArcade: OFFICIAL_ROUTES.AMBITION_ARCADE,
  gamification: OFFICIAL_ROUTES.GAMIFICATION,
  weeklyBars: OFFICIAL_ROUTES.WEEKLY_BARS,
  heatmapVibes: OFFICIAL_ROUTES.HEATMAP_VIBES,
  onboarding: OFFICIAL_ROUTES.ONBOARDING,
  preferences: OFFICIAL_ROUTES.PREFERENCES,
  socialCocon: OFFICIAL_ROUTES.SOCIAL_COCON,
  profileSettings: OFFICIAL_ROUTES.PROFILE_SETTINGS,
  activityHistory: OFFICIAL_ROUTES.ACTIVITY_HISTORY,
  notifications: OFFICIAL_ROUTES.NOTIFICATIONS,
  feedback: OFFICIAL_ROUTES.FEEDBACK,
  accountDelete: OFFICIAL_ROUTES.ACCOUNT_DELETE,
  exportCsv: OFFICIAL_ROUTES.EXPORT_CSV,
  privacyToggles: OFFICIAL_ROUTES.PRIVACY_TOGGLES,
  healthCheckBadge: OFFICIAL_ROUTES.HEALTH_CHECK_BADGE,
  teams: OFFICIAL_ROUTES.TEAMS,
  reports: OFFICIAL_ROUTES.REPORTS,
  events: OFFICIAL_ROUTES.EVENTS,
  optimisation: OFFICIAL_ROUTES.OPTIMISATION,
  settings: OFFICIAL_ROUTES.SETTINGS,
  security: OFFICIAL_ROUTES.SECURITY,
  audit: OFFICIAL_ROUTES.AUDIT,
  accessibility: OFFICIAL_ROUTES.ACCESSIBILITY,
  innovation: OFFICIAL_ROUTES.INNOVATION,
  helpCenter: OFFICIAL_ROUTES.HELP_CENTER
} as const;

export function buildUnifiedRoutes(): RouteObject[] {
  return unifiedRoutes;
}

export function validateRoute(route: string): route is keyof typeof ROUTES_MANIFEST {
  return Object.keys(ROUTES_MANIFEST).includes(route);
}

export const getRoutePath = (route: keyof typeof ROUTES_MANIFEST): string => {
  if (!validateRoute(route)) {
    throw new Error(`Invalid route name: ${route}`);
  }
  return ROUTES_MANIFEST[route];
};

export function validateRoutesManifest() {
  const routes = Object.values(ROUTES_MANIFEST);
  const uniqueRoutes = new Set(routes);
  
  return {
    valid: routes.length === uniqueRoutes.size,
    totalRoutes: routes.length,
    uniqueRoutes: uniqueRoutes.size,
    errors: routes.length !== uniqueRoutes.size ? ['Duplicate routes detected'] : []
  };
}

export type RouteManifestEntry = {
  path: string;
  name: keyof typeof ROUTES_MANIFEST;
};

export const ROUTE_MANIFEST: RouteManifestEntry[] = Object.entries(ROUTES_MANIFEST).map(([name, path]) => ({
  name: name as keyof typeof ROUTES_MANIFEST,
  path
}));
