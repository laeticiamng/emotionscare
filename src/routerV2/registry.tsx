/**
 * RouterV2 Registry - Définition des routes
 * TICKET: FE/BE-Router-Cleanup-01
 */

export const ROUTES_REGISTRY = [
  // Page d'accueil
  {
    name: 'Home',
    path: '/',
    component: 'HomePage',
    layout: 'marketing' as const,
    guard: false,
  },
  
  // Login/Signup
  {
    name: 'Login',
    path: '/login',
    component: 'UnifiedLoginPage',
    layout: 'simple' as const,
    guard: false,
  },
  
  {
    name: 'Signup',
    path: '/signup',
    component: 'SignupPage',
    layout: 'simple' as const,
    guard: false,
  },

  // App routes
  {
    name: 'App Gate',
    path: '/app',
    component: 'AppGatePage',
    layout: 'app' as const,
    guard: true,
  },

  {
    name: 'App Home',
    path: '/app/home',
    component: 'SimpleB2CPage',
    layout: 'app' as const,
    guard: true,
  },

  // Error pages
  {
    name: 'Not Found',
    path: '/404',
    component: 'NotFoundPage',
    layout: 'simple' as const,
    guard: false,
  },
];