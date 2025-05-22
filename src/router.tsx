
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

// Change from a named export to a default export
const routes = [
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
        path: 'b2b/admin/forgot-password',
        element: <ForgotPasswordPage mode="b2b_admin" />
      },
      {
        path: 'b2b/admin/reset-password',
        element: <ResetPasswordPage mode="b2b_admin" />
      }
    ]
  },
  // B2C Routes
  {
    path: '/b2c',
    element: <B2CLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'scan',
        element: <ScanPage />
      },
      {
        path: 'journal',
        element: <JournalPage />
      },
      {
        path: 'music',
        element: <MusicPage />
      },
      {
        path: 'audio',
        element: <AudioPage />
      },
      {
        path: 'coach',
        element: <CoachPage />
      },
      {
        path: 'vr',
        element: <VRPage />
      },
      {
        path: 'social',
        element: <SocialPage />
      },
      {
        path: 'progress',
        element: <ProgressPage />
      },
      {
        path: 'gamification',
        element: <GamificationPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'preferences',
        element: <PreferencesPage />
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />
      }
    ]
  },
  // B2B User Routes
  {
    path: '/b2b/user',
    element: <B2BUserLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'scan',
        element: <ScanPage />
      },
      {
        path: 'journal',
        element: <JournalPage />
      },
      {
        path: 'music',
        element: <MusicPage />
      },
      {
        path: 'audio',
        element: <AudioPage />
      },
      {
        path: 'coach',
        element: <CoachPage />
      },
      {
        path: 'vr',
        element: <VRPage />
      },
      {
        path: 'social',
        element: <SocialPage />
      },
      {
        path: 'progress',
        element: <ProgressPage />
      },
      {
        path: 'gamification',
        element: <GamificationPage />
      },
      {
        path: 'teams',
        element: <TeamsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'preferences',
        element: <PreferencesPage />
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />
      },
      {
        path: 'notifications',
        element: <NotificationsPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      }
    ]
  },
  // B2B Admin Routes
  {
    path: '/b2b/admin',
    element: <B2BAdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'scan',
        element: <ScanPage />
      },
      {
        path: 'journal',
        element: <JournalPage />
      },
      {
        path: 'music',
        element: <MusicPage />
      },
      {
        path: 'audio',
        element: <AudioPage />
      },
      {
        path: 'coach',
        element: <CoachPage />
      },
      {
        path: 'vr',
        element: <VRPage />
      },
      {
        path: 'teams',
        element: <TeamsPage />
      },
      {
        path: 'events',
        element: <EventsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'preferences',
        element: <PreferencesPage />
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />
      },
      {
        path: 'notifications',
        element: <NotificationsPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      }
    ]
  },
  // Catch-all route (404)
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
