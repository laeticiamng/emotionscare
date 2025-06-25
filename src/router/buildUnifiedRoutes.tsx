
import { RouteObject } from 'react-router-dom';
import { b2bRoutes } from './routes/b2bRoutes';
import { b2cRoutes } from './routes/b2cRoutes';
import { adminRoutes } from './routes/adminRoutes';
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

export const ROUTES_MANIFEST = {
  home: '/',
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
  b2cDashboard: '/b2c/dashboard',
  b2bDashboard: '/b2b/dashboard',
  adminDashboard: '/admin/dashboard',
  coachDashboard: '/coach/dashboard',
  notifications: '/notifications',
  settings: '/settings',
  wellness: '/wellness',
  emotions: '/emotions',
  journal: '/journal',
  debug: '/debug',
} as const;

const debugRoutes: RouteObject[] = import.meta.env.MODE === 'development' ? [
  {
    path: ROUTES_MANIFEST.debug,
    lazy: () => import('@/pages/DebugPage').then(module => ({ Component: module.default })),
  }
] : [];

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    ...authRoutes,
    ...b2cRoutes,
    ...b2bRoutes,
    ...adminRoutes,
    ...coachRoutes,
    ...notificationRoutes,
    ...onboardingRoutes,
    ...legalRoutes,
    ...settingsRoutes,
    ...wellnessRoutes,
    ...emotionRoutes,
    ...journalRoutes,
    ...rhRoutes,
    ...debugRoutes,
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
