import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import B2CLayout from '@/layouts/B2CLayout';
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';

// Public pages
import Home from './Home';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PreferencesPage from './pages/PreferencesPage';
import MenuPage from './pages/MenuPage';

// Page components
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import ChooseModeFlow from '@/pages/auth/ChooseModeFlow';
import B2BSelectionPage from '@/pages/auth/B2BSelectionPage';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';
import DashboardRedirect from '@/pages/DashboardRedirect';
import ImmersiveHome from '@/pages/ImmersiveHome';

// B2C Components
import B2CDashboard from '@/pages/b2c/B2CDashboard';
import B2CJournalPage from '@/pages/b2c/B2CJournalPage';
import B2CCoachingPage from '@/pages/b2c/B2CCoachingPage';
import B2CScanPage from '@/pages/b2c/B2CScanPage';
import B2CMusicPage from '@/pages/b2c/B2CMusicPage';
import B2CAudioPage from '@/pages/b2c/B2CAudioPage';
import B2CVideoPage from '@/pages/b2c/B2CVideoPage';
import B2CVrPage from '@/pages/b2c/B2CVrPage';
import B2CSocialPage from '@/pages/b2c/B2CSocialPage';
import B2CGamificationPage from '@/pages/b2c/B2CGamificationPage';
import B2CProfilePage from '@/pages/b2c/B2CProfilePage';

// B2B User Components
import B2BUserDashboard from '@/pages/b2b/user/B2BUserDashboard';
import B2BUserSessionsPage from '@/pages/b2b/user/B2BUserSessionsPage';
import B2BUserResourcesPage from '@/pages/b2b/user/B2BUserResourcesPage';
import B2BUserScanPage from '@/pages/b2b/user/B2BUserScanPage';
import B2BUserMusicPage from '@/pages/b2b/user/B2BUserMusicPage';
import B2BUserAudioPage from '@/pages/b2b/user/B2BUserAudioPage';
import B2BUserVideoPage from '@/pages/b2b/user/B2BUserVideoPage';
import B2BUserVrPage from '@/pages/b2b/user/B2BUserVrPage';
import B2BUserSocialPage from '@/pages/b2b/user/B2BUserSocialPage';
import B2BUserGamificationPage from '@/pages/b2b/user/B2BUserGamificationPage';
import B2BUserProfilePage from '@/pages/b2b/user/B2BUserProfilePage';

// B2B Admin Components
import B2BAdminDashboard from '@/pages/b2b/admin/B2BAdminDashboard';
import B2BAdminUsersPage from '@/pages/b2b/admin/B2BAdminUsersPage';
import B2BAdminAnalyticsPage from '@/pages/b2b/admin/B2BAdminAnalyticsPage';
import B2BAdminSettingsPage from '@/pages/b2b/admin/B2BAdminSettingsPage';
import B2BAdminTeamsPage from '@/pages/b2b/admin/B2BAdminTeamsPage';
import B2BAdminReportsPage from '@/pages/b2b/admin/B2BAdminReportsPage';
import B2BAdminEventsPage from '@/pages/b2b/admin/B2BAdminEventsPage';
import B2BAdminScanPage from '@/pages/b2b/admin/B2BAdminScanPage';
import B2BAdminMusicPage from '@/pages/b2b/admin/B2BAdminMusicPage';

// Define all routes
export const routes: RouteObject[] = [
  // Public routes
  {
    path: '/',
    element: <ImmersiveHome />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/landing',
    element: <LandingPage />
  },
  {
    path: '/welcome',
    element: <Home />
  },
  {
    path: '/choose-mode',
    element: <ChooseModeFlow />
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />
  },
  {
    path: '/menu',
    element: <MenuPage />
  },
  
  // Generic mode redirect routes
  {
    path: '/dashboard',
    element: <DashboardRedirect />
  },
  {
    path: '/scan',
    element: <DashboardRedirect />
  },
  {
    path: '/journal',
    element: <DashboardRedirect />
  },
  {
    path: '/music',
    element: <DashboardRedirect />
  },
  
  // Auth routes
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <ForgotPasswordPage />
      }
    ]
  },
  {
    path: '/reset-password/:token',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <ResetPasswordPage />
      }
    ]
  },
  
  // B2C Routes
  {
    path: '/b2c',
    element: <B2CLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage mode="b2c" />
      },
      {
        path: 'register',
        element: <RegisterPage mode="b2c" />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage mode="b2c" />
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordPage mode="b2c" />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CDashboard />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'journal',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CJournalPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'coach',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CCoachingPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'scan',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CScanPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'music',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CMusicPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'audio',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CAudioPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'video',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CVideoPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'vr',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CVrPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'social',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CSocialPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'gamification',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CGamificationPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <B2CProfilePage />
          </ProtectedRouteWithMode>
        )
      }
    ]
  },
  
  // B2B User Routes
  {
    path: '/b2b/user',
    element: <B2BUserLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage mode="b2b_user" />
      },
      {
        path: 'register',
        element: <RegisterPage mode="b2b_user" />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage mode="b2b_user" />
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordPage mode="b2b_user" />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserDashboard />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'sessions',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserSessionsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'resources',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserResourcesPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'scan',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserScanPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'music',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserMusicPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'audio',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserAudioPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'video',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserVideoPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'vr',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserVrPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'social',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserSocialPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'gamification',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserGamificationPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <B2BUserProfilePage />
          </ProtectedRouteWithMode>
        )
      }
    ]
  },
  
  // B2B Admin Routes
  {
    path: '/b2b/admin',
    element: <B2BAdminLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage mode="b2b_admin" />
      },
      {
        path: 'register',
        element: <RegisterPage mode="b2b_admin" />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage mode="b2b_admin" />
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordPage mode="b2b_admin" />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminDashboard />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'users',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminUsersPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminAnalyticsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminSettingsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'teams',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminTeamsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'reports',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminReportsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'events',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminEventsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'scan',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminScanPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'music',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <B2BAdminMusicPage />
          </ProtectedRouteWithMode>
        )
      },
    ]
  },
  
  // Misc Routes
  {
    path: '/preferences',
    element: <PreferencesPage />
  },
  
  // 404 route
  {
    path: '*',
    element: <NotFoundPage />
  }
];

// Export routes as default and named export
export default routes;
