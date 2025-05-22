
import React from 'react';
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

// Page components
import ImmersiveHome from './pages/ImmersiveHome';
import ChooseModeFlow from '@/pages/auth/ChooseModeFlow';
import B2BSelectionPage from './pages/B2BSelectionPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import JournalPage from './pages/JournalPage';
import MusicPage from './pages/MusicPage';
import AudioPage from './pages/AudioPage';
import CoachPage from './pages/CoachPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TeamsPage from './pages/TeamsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PreferencesPage from './pages/PreferencesPage';
import OnboardingPage from './pages/OnboardingPage';
import VRPage from './pages/VRPage';
import SocialPage from './pages/SocialPage';
import ProgressPage from './pages/ProgressPage';
import GamificationPage from './pages/GamificationPage';

// These pages redirect to the appropriate page based on user mode
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Music from './pages/Music';
import Audio from './pages/Audio';
import Coach from './pages/Coach';
import Progress from './pages/Progress';
import Social from './pages/Social';
import VR from './pages/VR';
import Gamification from './pages/Gamification';

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
  
  // Generic mode redirect routes
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/journal',
    element: <Journal />
  },
  {
    path: '/music',
    element: <Music />
  },
  {
    path: '/audio',
    element: <Audio />
  },
  {
    path: '/coach',
    element: <Coach />
  },
  {
    path: '/progress',
    element: <Progress />
  },
  {
    path: '/vr',
    element: <VR />
  },
  {
    path: '/social',
    element: <Social />
  },
  {
    path: '/gamification',
    element: <Gamification />
  },

  // Auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      // B2C Auth
      {
        path: 'b2c/login',
        element: <LoginPage mode="b2c" />
      },
      {
        path: 'b2c/register',
        element: <RegisterPage mode="b2c" />
      },
      {
        path: 'b2c/forgot-password',
        element: <ForgotPasswordPage mode="b2c" />
      },
      {
        path: 'b2c/reset-password',
        element: <ResetPasswordPage mode="b2c" />
      },
      // B2B User Auth
      {
        path: 'b2b/user/login',
        element: <LoginPage mode="b2b_user" />
      },
      {
        path: 'b2b/user/register',
        element: <RegisterPage mode="b2b_user" />
      },
      {
        path: 'b2b/user/forgot-password',
        element: <ForgotPasswordPage mode="b2b_user" />
      },
      {
        path: 'b2b/user/reset-password',
        element: <ResetPasswordPage mode="b2b_user" />
      },
      // B2B Admin Auth
      {
        path: 'b2b/admin/login',
        element: <LoginPage mode="b2b_admin" />
      },
      {
        path: 'b2b/admin/register',
        element: <RegisterPage mode="b2b_admin" />
      },
      {
        path: 'b2b/admin/forgot-password',
        element: <ForgotPasswordPage mode="b2b_admin" />
      },
      {
        path: 'b2b/admin/reset-password',
        element: <ResetPasswordPage mode="b2b_admin" />
      }
    ]
  },

  // App routes - B2C
  {
    path: 'b2c/',
    element: <B2CLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <DashboardPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'scan',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <ScanPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'journal',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <JournalPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'music',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <MusicPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'audio',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <AudioPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'coach',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <CoachPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'progress',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <ProgressPage />
          </ProtectedRouteWithMode>
        )
      },
       {
        path: 'gamification',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <GamificationPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'vr',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <VRPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'social',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <SocialPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <SettingsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <ProfilePage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <NotificationsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <PreferencesPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c">
            <OnboardingPage />
          </ProtectedRouteWithMode>
        )
      }
    ]
  },

  // App routes - B2B User
  {
    path: 'b2b/user/',
    element: <B2BUserLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <DashboardPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'scan',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <ScanPage />
          </ProtectedRouteWithMode>
        )
      },
       {
        path: 'journal',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <JournalPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'music',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <MusicPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'audio',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <AudioPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'coach',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <CoachPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'progress',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <ProgressPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'gamification',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <GamificationPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'vr',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <VRPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'social',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <SocialPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'teams',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <TeamsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'events',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <EventsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <SettingsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <ProfilePage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <NotificationsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <PreferencesPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user">
            <OnboardingPage />
          </ProtectedRouteWithMode>
        )
      }
    ]
  },

  // App routes - B2B Admin
  {
    path: 'b2b/admin/',
    element: <B2BAdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <DashboardPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'scan',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <ScanPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'journal',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <JournalPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'music',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <MusicPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'audio',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <AudioPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'coach',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <CoachPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'progress',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <ProgressPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'gamification',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <GamificationPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'vr',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <VRPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'social',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <SocialPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'teams',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <TeamsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'events',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <EventsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <SettingsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <ProfilePage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <NotificationsPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <PreferencesPage />
          </ProtectedRouteWithMode>
        )
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin">
            <OnboardingPage />
          </ProtectedRouteWithMode>
        )
      }
    ]
  },

  // Not found route
  {
    path: '*',
    element: <NotFoundPage />
  }
];
