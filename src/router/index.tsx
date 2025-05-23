
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import Shell from '@/Shell';

// Pages publiques
import LandingPage from '@/pages/LandingPage';
import ChooseModePage from '@/pages/ChooseModePage';
import NotFoundPage from '@/pages/common/NotFoundPage';

// Pages B2C
import B2CLoginPage from '@/pages/b2c/auth/B2CLoginPage';
import B2CRegisterPage from '@/pages/b2c/auth/B2CRegisterPage';
import B2CResetPasswordPage from '@/pages/b2c/auth/B2CResetPasswordPage';
import B2CDashboardPage from '@/pages/b2c/dashboard/B2CDashboardPage';
import B2COnboardingPage from '@/pages/b2c/onboarding/B2COnboardingPage';
import B2CScanPage from '@/pages/b2c/scan/B2CScanPage';
import B2CSocialPage from '@/pages/b2c/social/B2CSocialPage';

// Pages B2B User
import B2BUserLoginPage from '@/pages/b2b/user/auth/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/b2b/user/auth/B2BUserRegisterPage';
import B2BUserDashboardPage from '@/pages/b2b/user/dashboard/B2BUserDashboardPage';
import B2BUserScanPage from '@/pages/b2b/user/scan/B2BUserScanPage';
import B2BUserSocialPage from '@/pages/b2b/user/social/B2BUserSocialPage';

// Pages B2B Admin
import B2BAdminLoginPage from '@/pages/b2b/admin/auth/B2BAdminLoginPage';
import B2BAdminDashboardPage from '@/pages/b2b/admin/dashboard/B2BAdminDashboardPage';
import B2BAdminAnalyticsPage from '@/pages/b2b/admin/analytics/B2BAdminAnalyticsPage';
import B2BAdminUsersPage from '@/pages/b2b/admin/users/B2BAdminUsersPage';

// Pages communes
import B2BSelectionPage from '@/pages/auth/B2BSelectionPage';
import ProfilePage from '@/pages/common/ProfilePage';
import SettingsPage from '@/pages/common/SettingsPage';
import HelpPage from '@/pages/common/HelpPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  
  // Routes B2C
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <B2CLoginPage />,
      },
      {
        path: 'register',
        element: <B2CRegisterPage />,
      },
      {
        path: 'reset-password',
        element: <B2CResetPasswordPage />,
      },
      {
        path: 'onboarding',
        element: <B2COnboardingPage />,
      },
    ],
  },
  
  // Routes B2B User
  {
    path: '/b2b/user',
    children: [
      {
        path: 'login',
        element: <B2BUserLoginPage />,
      },
      {
        path: 'register',
        element: <B2BUserRegisterPage />,
      },
    ],
  },
  
  // Routes B2B Admin
  {
    path: '/b2b/admin',
    children: [
      {
        path: 'login',
        element: <B2BAdminLoginPage />,
      },
    ],
  },
  
  // Routes protégées avec Shell
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        path: '',
        element: <Shell />,
        children: [
          // Routes B2C protégées
          {
            path: 'b2c/dashboard',
            element: <B2CDashboardPage />,
          },
          {
            path: 'b2c/scan',
            element: <B2CScanPage />,
          },
          {
            path: 'b2c/social',
            element: <B2CSocialPage />,
          },
          
          // Routes B2B User protégées
          {
            path: 'b2b/user/dashboard',
            element: <B2BUserDashboardPage />,
          },
          {
            path: 'b2b/user/scan',
            element: <B2BUserScanPage />,
          },
          {
            path: 'b2b/user/social',
            element: <B2BUserSocialPage />,
          },
          
          // Routes B2B Admin protégées
          {
            path: 'b2b/admin/dashboard',
            element: <B2BAdminDashboardPage />,
          },
          {
            path: 'b2b/admin/analytics',
            element: <B2BAdminAnalyticsPage />,
          },
          {
            path: 'b2b/admin/users',
            element: <B2BAdminUsersPage />,
          },
          
          // Routes communes
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'help',
            element: <HelpPage />,
          },
        ],
      },
    ],
  },
  
  // Route 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
