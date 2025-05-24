
import React, { lazy } from 'react';

// Pages B2C
export const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
export const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
export const B2CResetPasswordPage = lazy(() => import('@/pages/b2c/ResetPasswordPage'));
export const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));
export const B2COnboardingPage = lazy(() => import('@/pages/b2c/OnboardingPage'));

// Pages B2B
export const B2BSelectionPage = lazy(() => import('@/pages/b2b/SelectionPage'));
export const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
export const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
export const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));
export const B2BUserScanPage = lazy(() => import('@/pages/b2b/user/ScanPage'));
export const B2BUserCoachPage = lazy(() => import('@/pages/b2b/user/CoachPage'));
export const B2BUserMusicPage = lazy(() => import('@/pages/b2b/user/MusicPage'));
export const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
export const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

// Pages générales
export const HomePage = lazy(() => import('@/pages/HomePage'));
export const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

export default {
  // B2C
  B2CLoginPage,
  B2CRegisterPage,
  B2CResetPasswordPage,
  B2CDashboardPage,
  B2COnboardingPage,
  
  // B2B
  B2BSelectionPage,
  B2BUserLoginPage,
  B2BUserRegisterPage,
  B2BUserDashboardPage,
  B2BUserScanPage,
  B2BUserCoachPage,
  B2BUserMusicPage,
  B2BAdminLoginPage,
  B2BAdminDashboardPage,
  
  // Général
  HomePage,
  ChooseModePage,
};
