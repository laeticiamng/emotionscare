/**
 * Types et constantes pour la navigation
 */

import { routes } from '@/routerV2';

// Constantes de routes pour la navigation
export const ROUTES = {
  HOME: routes.public.home(),
  B2C_HOME: routes.b2c.home(),
  B2B_HOME: routes.b2b.home(),
  
  // Dashboards
  B2C_DASHBOARD: routes.b2c.dashboard(),
  B2B_USER_DASHBOARD: routes.b2b.user.dashboard(),
  B2B_ADMIN_DASHBOARD: routes.b2b.admin.dashboard(),
  
  // Auth
  LOGIN: routes.auth.login(),
  SIGNUP: routes.auth.signup(),
  
  // B2C Features
  SCAN: routes.b2c.scan(),
  MUSIC: routes.b2c.music(),
  COACH: routes.b2c.coach(),
  JOURNAL: routes.b2c.journal(),
  VR: routes.b2c.vr(),
  SETTINGS: routes.b2c.settings(),
  
  // B2B Features
  TEAMS: routes.b2b.teams(),
  REPORTS: routes.b2b.reports(),
  EVENTS: routes.b2b.events(),
  ANALYTICS: routes.b2b.admin.analytics(),
  
  // Fun-First Modules
  BOSS_LEVEL: routes.b2c.bossLevel(),
  FLASH_GLOW: routes.b2c.flashGlow(),
  BREATHWORK: routes.b2c.breathwork(),
  AR_FILTERS: routes.b2c.arFilters(),
  BUBBLE_BEAT: routes.b2c.bubbleBeat(),
  MOOD_MIXER: routes.b2c.moodMixer(),
  STORY_SYNTH: routes.b2c.storySynth(),
  BOUNCE_BACK: routes.b2c.bounceBack(),
  
  // Special
  CHOOSE_MODE: routes.special.chooseMode(),
  UNAUTHORIZED: routes.special.unauthorized(),
  NOT_FOUND: routes.special.notFound(),
} as const;

// Types pour la navigation
export type NavigationRoute = keyof typeof ROUTES;

export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType;
  badge?: string;
  premium?: boolean;
  roles?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}