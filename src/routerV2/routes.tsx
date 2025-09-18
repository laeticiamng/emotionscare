/**
 * RouterV2 Routes - Routes helpers
 * TICKET: FE/BE-Router-Cleanup-01
 */

export const routes = {
  b2c: {
    home: () => '/',
    login: () => '/login',
    signup: () => '/signup',
    scan: () => '/app/scan',
    journal: () => '/app/journal',
    music: () => '/app/music',
    coach: () => '/app/coach',
    settings: () => '/app/settings',
    flashGlow: () => '/app/flash-glow',
    community: () => '/app/community',
  },
  b2b: {
    login: () => '/b2b/login',
    dashboard: () => '/b2b/dashboard',
    teams: () => '/b2b/teams',
    reports: () => '/b2b/reports',
  },
  app: {
    home: () => '/app/home',
    dashboard: () => '/app/dashboard',
  },
};