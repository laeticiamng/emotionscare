
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import Shell from '@/Shell';
import AuthTransition from './components/auth/AuthTransition';

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

// Pages B2B User
import B2BUserLoginPage from '@/pages/b2b/user/auth/B2BUserLoginPage';
import B2BUserRegisterPage from '@/pages/b2b/user/auth/B2BUserRegisterPage';
import B2BUserDashboardPage from '@/pages/b2b/user/dashboard/B2BUserDashboardPage';

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

// Pages fonctionnelles
import ScanPage from '@/pages/ScanPage';
import Coach from '@/pages/Coach';
import Music from '@/pages/Music';
import Journal from '@/pages/Journal';

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
    path: '/b2c/onboarding',
    element: <B2COnboardingPage />,
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
  
  // Routes B2B Admin
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
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
            element: <AuthTransition><B2CDashboardPage /></AuthTransition>
          },
          
          // Routes B2B User protégées
          {
            path: 'b2b/user/dashboard',
            element: <AuthTransition><B2BUserDashboardPage /></AuthTransition>
          },
          
          // Routes B2B Admin protégées
          {
            path: 'b2b/admin/dashboard',
            element: <AuthTransition><B2BAdminDashboardPage /></AuthTransition>
          },
          {
            path: 'b2b/admin/analytics',
            element: <AuthTransition><B2BAdminAnalyticsPage /></AuthTransition>
          },
          {
            path: 'b2b/admin/users',
            element: <AuthTransition><B2BAdminUsersPage /></AuthTransition>
          },
          
          // Routes fonctionnelles accessibles à tous les utilisateurs connectés
          {
            path: 'scan',
            element: <AuthTransition><ScanPage /></AuthTransition>
          },
          {
            path: 'coach',
            element: <AuthTransition><Coach /></AuthTransition>
          },
          {
            path: 'music',
            element: <AuthTransition><Music /></AuthTransition>
          },
          {
            path: 'journal',
            element: <AuthTransition><Journal /></AuthTransition>
          },
          
          // Routes communes
          {
            path: 'profile',
            element: <AuthTransition><ProfilePage /></AuthTransition>
          },
          {
            path: 'settings',
            element: <AuthTransition><SettingsPage /></AuthTransition>
          },
          {
            path: 'help',
            element: <AuthTransition><HelpPage /></AuthTransition>
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
