
import { RouteObject } from 'react-router-dom';
import { homeRoutes } from './routes/homeRoutes';
import { b2bRedirectRoutes } from './routes/b2bRedirectRoutes';
import { b2bRoutes } from './routes/b2bRoutes';
import { b2cRoutes } from './routes/b2cRoutes';
import { authRoutes } from './routes/authRoutes';
import { coachRoutes } from './routes/coachRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { legalRoutes } from './routes/legalRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { wellnessRoutes } from './routes/wellnessRoutes';
import { emotionRoutes } from './routes/emotionRoutes';
import { journalRoutes } from './routes/journalRoutes';
import { rhRoutes } from './routes/rhRoutes';
import { optimizedRoutes } from './routes/lazyRoutes';

export const ROUTES_MANIFEST = {
  home: '/',
  chooseMode: '/choose-mode',
  auth: '/auth',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  logout: '/logout',
  terms: '/terms',
  privacy: '/privacy',
  contact: '/contact',
  about: '/about',
  pricing: '/pricing',
  features: '/features',
  faq: '/faq',
  onboarding: '/onboarding',
  b2c: '/b2c',
  b2cLogin: '/b2c/login',
  b2cRegister: '/b2c/register',
  b2cDashboard: '/b2c/dashboard',
  b2b: '/b2b',
  b2bSelection: '/b2b/selection',
  b2bUserLogin: '/b2b/user/login',
  b2bAdminLogin: '/b2b/admin/login',
  b2bUserDashboard: '/b2b/user/dashboard',
  b2bAdminDashboard: '/b2b/admin/dashboard',
  coachDashboard: '/coach/dashboard',
  notifications: '/notifications',
  settings: '/settings',
  wellness: '/wellness',
  emotions: '/emotions',
  journal: '/journal',
} as const;

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    ...homeRoutes,
    ...authRoutes,
    ...b2bRedirectRoutes,
    ...b2bRoutes,
    ...b2cRoutes,
    ...coachRoutes,
    ...notificationRoutes,
    ...onboardingRoutes,
    ...legalRoutes,
    ...settingsRoutes,
    ...wellnessRoutes,
    ...emotionRoutes,
    ...journalRoutes,
    ...rhRoutes,
    ...optimizedRoutes,
  ];
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
