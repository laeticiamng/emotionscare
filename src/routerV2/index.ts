/**
 * RouterV2 - Index principal et utilitaires de routage
 * TICKET: FE/BE-Router-Cleanup-01
 */

export * from './router';
export * from './schema';

// Utilitaire pour générer les routes typées
export const routes = {
  // Routes publiques
  public: {
    home: () => '/',
    about: () => '/about',
    contact: () => '/contact',
    help: () => '/help',
    demo: () => '/demo',
    privacy: () => '/privacy',
    b2c: () => '/b2c',
    entreprise: () => '/entreprise',
  },

  // Routes d'authentification
  auth: {
    login: () => '/login',
    signup: () => '/signup',
  },

  // Routes d'application
  app: {
    gate: () => '/app',
  },

  // Routes B2C
  b2c: {
    dashboard: () => '/app/home',
    scan: () => '/app/scan',
    music: () => '/app/music',
    coach: () => '/app/coach',
    journal: () => '/app/journal',
    vr: () => '/app/vr',
  },

  // Routes B2B
  b2b: {
    user: {
      dashboard: () => '/app/collab',
    },
    admin: {
      dashboard: () => '/app/rh',
    },
    selection: () => '/b2b/selection',
    reports: () => '/b2b/reports',
  },

  // Routes d'erreur
  errors: {
    notFound: () => '/404',
    unauthorized: () => '/401',
    forbidden: () => '/403',
    serverError: () => '/500',
  },
} as const;

export type Routes = typeof routes;