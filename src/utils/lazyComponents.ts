import { lazy, ComponentType } from 'react';
import { retryLazyImport } from './retryLazyImport';

// Lazy loading avec retry automatique en cas d'échec
const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) => {
  return lazy(() => retryLazyImport(importFn, 3));
};

// B2C Pages - Lazy loaded
export const B2CLoginPage = createLazyComponent(() => import('@/pages/b2c/auth/B2CLoginPage'));
export const B2CRegisterPage = createLazyComponent(() => import('@/pages/b2c/auth/B2CRegisterPage'));
export const B2CResetPasswordPage = createLazyComponent(() => import('@/pages/b2c/auth/B2CResetPasswordPage'));
export const B2CDashboardPage = createLazyComponent(() => import('@/pages/b2c/dashboard/B2CDashboardPage'));
export const B2COnboardingPage = createLazyComponent(() => import('@/pages/b2c/onboarding/B2COnboardingPage'));

// B2B Pages - Lazy loaded
export const B2BSelectionPage = createLazyComponent(() => import('@/pages/auth/B2BSelectionPage'));
export const B2BUserLoginPage = createLazyComponent(() => import('@/pages/b2b/user/auth/B2BUserLoginPage'));
export const B2BUserRegisterPage = createLazyComponent(() => import('@/pages/b2b/user/auth/B2BUserRegisterPage'));
export const B2BUserDashboardPage = createLazyComponent(() => import('@/pages/b2b/user/dashboard/B2BUserDashboardPage'));
export const B2BUserScanPage = createLazyComponent(() => import('@/pages/b2b/user/scan/B2BUserScanPage'));
export const B2BUserCoachPage = createLazyComponent(() => import('@/pages/b2b/user/coach/B2BUserCoachPage'));
export const B2BUserMusicPage = createLazyComponent(() => import('@/pages/b2b/user/music/B2BUserMusicPage'));
export const B2BAdminLoginPage = createLazyComponent(() => import('@/pages/b2b/admin/auth/B2BAdminLoginPage'));
export const B2BAdminDashboardPage = createLazyComponent(() => import('@/pages/b2b/admin/dashboard/B2BAdminDashboardPage'));

// Other Pages
export const HomePage = createLazyComponent(() => import('@/pages/HomePage'));
export const ChooseModePage = createLazyComponent(() => import('@/pages/auth/ChooseModeFlow'));
