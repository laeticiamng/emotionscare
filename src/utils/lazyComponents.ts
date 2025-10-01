// @ts-nocheck

import { lazy } from 'react';

// B2C Components
export const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
export const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
export const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));
export const B2COnboardingPage = lazy(() => import('@/pages/b2c/OnboardingPage'));
export const B2CJournalPage = lazy(() => import('@/pages/b2c/JournalPage'));
export const B2CMusicPage = lazy(() => import('@/pages/b2c/MusicPage'));
export const B2CScanPage = lazy(() => import('@/pages/b2c/ScanPage'));
export const B2CCoachPage = lazy(() => import('@/pages/b2c/CoachPage'));
export const B2CVRPage = lazy(() => import('@/pages/b2c/VRPage'));
export const B2CGamificationPage = lazy(() => import('@/pages/b2c/GamificationPage'));
export const B2CSocialPage = lazy(() => import('@/pages/b2c/SocialPage'));
export const B2CSettingsPage = lazy(() => import('@/pages/b2c/SettingsPage'));

// B2B User Components
export const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
export const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
export const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));
export const B2BUserScanPage = lazy(() => import('@/pages/b2b/user/ScanPage'));
export const B2BUserCoachPage = lazy(() => import('@/pages/b2b/user/CoachPage'));
export const B2BUserMusicPage = lazy(() => import('@/pages/b2b/user/MusicPage'));

// B2B Admin Components
export const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
export const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));
