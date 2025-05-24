import React from 'react';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// B2C Pages
const B2CLoginPage = React.lazy(() => import('@/pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/b2c/auth/B2CRegisterPage'));
const B2CResetPasswordPage = React.lazy(() => import('@/pages/b2c/auth/B2CResetPasswordPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/b2c/dashboard/B2CDashboardPage'));
const B2COnboardingPage = React.lazy(() => import('@/pages/b2c/onboarding/B2COnboardingPage'));
const B2CScanPage = React.lazy(() => import('@/pages/b2c/scan/B2CScanPage'));
const B2CSocialPage = React.lazy(() => import('@/pages/b2c/social/B2CSocialPage'));
const B2CJournalPage = React.lazy(() => import('@/pages/b2c/journal/B2CJournalPage'));
const B2CMusicPage = React.lazy(() => import('@/pages/b2c/music/B2CMusicPage'));
const B2CCoachPage = React.lazy(() => import('@/pages/b2c/coach/B2CCoachPage'));

// B2B User Pages
const B2BUserLoginPage = React.lazy(() => import('@/pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/b2b/user/auth/B2BUserRegisterPage'));
const B2BUserDashboardPage = React.lazy(() => import('@/pages/b2b/user/dashboard/B2BUserDashboardPage'));
const B2BUserScanPage = React.lazy(() => import('@/pages/b2b/user/scan/B2BUserScanPage'));
const B2BUserSocialPage = React.lazy(() => import('@/pages/b2b/user/social/B2BUserSocialPage'));
const B2BUserJournalPage = React.lazy(() => import('@/pages/b2b/user/journal/B2BUserJournalPage'));
const B2BUserMusicPage = React.lazy(() => import('@/pages/b2b/user/music/B2BUserMusicPage'));
const B2BUserCoachPage = React.lazy(() => import('@/pages/b2b/user/coach/B2BUserCoachPage'));

// B2B Admin Pages
const B2BAdminLoginPage = React.lazy(() => import('@/pages/b2b/admin/auth/B2BAdminLoginPage'));
const B2BAdminDashboardPage = React.lazy(() => import('@/pages/b2b/admin/dashboard/B2BAdminDashboardPage'));
const B2BAdminUsersPage = React.lazy(() => import('@/pages/b2b/admin/users/B2BAdminUsersPage'));
const B2BAdminAnalyticsPage = React.lazy(() => import('@/pages/b2b/admin/analytics/B2BAdminAnalyticsPage'));

// B2B Selection
const B2BRoleSelectionPage = React.lazy(() => import('@/pages/b2b/selection/B2BRoleSelectionPage'));

// Shared Application Pages
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const Coach = React.lazy(() => import('@/pages/Coach'));
const Music = React.lazy(() => import('@/pages/Music'));
const Journal = React.lazy(() => import('@/pages/Journal'));

// Other Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const HelpPage = React.lazy(() => import('@/pages/HelpPage'));

const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />
  },
  
  // B2C Routes
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <B2CLoginPage />
      },
      {
        path: 'register',
        element: <B2CRegisterPage />
      },
      {
        path: 'reset-password',
        element: <B2CResetPasswordPage />
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2COnboardingPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <B2CDashboardPage />
          }
        ]
      },
      {
        path: 'scan',
        element: <B2CScanPage />
      },
      {
        path: 'social',
        element: <B2CSocialPage />
      },
      {
        path: 'journal',
        element: <B2CJournalPage />
      },
      {
        path: 'music',
        element: <B2CMusicPage />
      },
      {
        path: 'coach',
        element: <B2CCoachPage />
      }
    ]
  },

  // B2B User Routes
  {
    path: '/b2b/user',
    children: [
      {
        path: 'login',
        element: <B2BUserLoginPage />
      },
      {
        path: 'register',
        element: <B2BUserRegisterPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2b_user">
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <B2BUserDashboardPage />
          }
        ]
      },
      {
        path: 'scan',
        element: <B2BUserScanPage />
      },
      {
        path: 'social',
        element: <B2BUserSocialPage />
      },
      {
        path: 'journal',
        element: <B2BUserJournalPage />
      },
      {
        path: 'music',
        element: <B2BUserMusicPage />
      },
      {
        path: 'coach',
        element: <B2BUserCoachPage />
      }
    ]
  },

  // B2B Admin Routes
  {
    path: '/b2b/admin',
    children: [
      {
        path: 'login',
        element: <B2BAdminLoginPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2b_admin">
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <B2BAdminDashboardPage />
          }
        ]
      },
      {
        path: 'users',
        element: <B2BAdminUsersPage />
      },
      {
        path: 'analytics',
        element: <B2BAdminAnalyticsPage />
      }
    ]
  },

  // B2B Selection
  {
    path: '/b2b/selection',
    element: <B2BRoleSelectionPage />
  },

  // Shared routes
  {
    path: '/scan',
    element: <ScanPage />
  },
  {
    path: '/coach',
    element: <Coach />
  },
  {
    path: '/music',
    element: <Music />
  },
  {
    path: '/journal',
    element: <Journal />
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/help',
    element: <HelpPage />
  },

  // Catch all route
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes;
