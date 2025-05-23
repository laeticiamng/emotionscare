
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Pages d'authentification et communes
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const ChooseModePage = React.lazy(() => import('./pages/auth/ChooseModePage'));
const B2BSelectionPage = React.lazy(() => import('./pages/common/B2BSelection'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardRedirect = React.lazy(() => import('./pages/DashboardRedirect'));
const ProfilePage = React.lazy(() => import('./pages/common/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/common/SettingsPage'));
const BillingPage = React.lazy(() => import('./pages/common/BillingPage'));
const NotFoundPage = React.lazy(() => import('./pages/common/NotFoundPage'));

// Pages B2C
const B2CLoginPage = React.lazy(() => import('./pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('./pages/b2c/auth/B2CRegisterPage'));
const B2CResetPasswordPage = React.lazy(() => import('./pages/b2c/auth/B2CResetPasswordPage'));
const B2CDashboardPage = React.lazy(() => import('./pages/b2c/dashboard/B2CDashboardPage'));
const B2COnboardingPage = React.lazy(() => import('./pages/b2c/onboarding/B2COnboardingPage'));
const B2CSocialPage = React.lazy(() => import('./pages/b2c/social/B2CSocialPage'));
const B2CScanPage = React.lazy(() => import('./pages/b2c/scan/B2CScanPage'));

// Pages B2B User
const B2BUserLoginPage = React.lazy(() => import('./pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('./pages/b2b/user/auth/B2BUserRegisterPage'));
const B2BUserDashboardPage = React.lazy(() => import('./pages/b2b/user/dashboard/B2BUserDashboardPage'));
const B2BUserSocialPage = React.lazy(() => import('./pages/b2b/user/social/B2BUserSocialPage'));
const B2BUserScanPage = React.lazy(() => import('./pages/b2b/user/scan/B2BUserScanPage'));

// Pages B2B Admin
const B2BAdminLoginPage = React.lazy(() => import('./pages/b2b/admin/auth/B2BAdminLoginPage'));
const B2BAdminDashboardPage = React.lazy(() => import('./pages/b2b/admin/dashboard/B2BAdminDashboardPage'));
const B2BAdminSocialPage = React.lazy(() => import('./pages/b2b/admin/social/B2BAdminSocialPage'));
const B2BAdminUsersPage = React.lazy(() => import('./pages/b2b/admin/users/B2BAdminUsersPage'));
const B2BAdminTeamsPage = React.lazy(() => import('./pages/b2b/admin/teams/B2BAdminTeamsPage'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardRedirect />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/billing',
    element: <BillingPage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  
  // Routes B2C
  {
    path: '/b2c/login',
    element: <B2CLoginPage />,
  },
  {
    path: '/b2c/register',
    element: <B2CRegisterPage />,
  },
  {
    path: '/b2c/reset-password',
    element: <B2CResetPasswordPage />,
  },
  {
    path: '/b2c/dashboard',
    element: <B2CDashboardPage />,
  },
  {
    path: '/b2c/onboarding',
    element: <B2COnboardingPage />,
  },
  {
    path: '/b2c/social',
    element: <B2CSocialPage />,
  },
  {
    path: '/b2c/scan',
    element: <B2CScanPage />,
  },
  
  // Routes B2B User
  {
    path: '/b2b/user/login',
    element: <B2BUserLoginPage />,
  },
  {
    path: '/b2b/user/register',
    element: <B2BUserRegisterPage />,
  },
  {
    path: '/b2b/user/dashboard',
    element: <B2BUserDashboardPage />,
  },
  {
    path: '/b2b/user/social',
    element: <B2BUserSocialPage />,
  },
  {
    path: '/b2b/user/scan',
    element: <B2BUserScanPage />,
  },
  
  // Routes B2B Admin
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: <B2BAdminDashboardPage />,
  },
  {
    path: '/b2b/admin/social-cocoon',
    element: <B2BAdminSocialPage />,
  },
  {
    path: '/b2b/admin/users',
    element: <B2BAdminUsersPage />,
  },
  {
    path: '/b2b/admin/teams',
    element: <B2BAdminTeamsPage />,
  },
  
  // Not found
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
