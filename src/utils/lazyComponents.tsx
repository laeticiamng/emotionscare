
import { lazy } from 'react';

// B2C Pages
export const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
export const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
export const B2CResetPasswordPage = lazy(() => import('@/pages/b2c/ResetPasswordPage'));
export const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));
export const B2COnboardingPage = lazy(() => import('@/pages/b2c/OnboardingPage'));

// B2B User Pages
export const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
export const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
export const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));
export const B2BUserScanPage = lazy(() => import('@/pages/b2b/user/ScanPage'));
export const B2BUserCoachPage = lazy(() => import('@/pages/b2b/user/CoachPage'));
export const B2BUserMusicPage = lazy(() => import('@/pages/b2b/user/MusicPage'));

// B2B Admin Pages
export const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
export const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));
