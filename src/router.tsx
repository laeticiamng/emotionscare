import React from 'react';
import { RouteObject } from 'react-router-dom';
import ImmersiveHome from '@/pages/ImmersiveHome';
import B2BSelectionPage from '@/pages/auth/B2BSelectionPage';
import OptimizationPage from '@/pages/OptimizationPage';
import TeamsPage from '@/pages/TeamsPage';
import JournalPage from '@/pages/JournalPage';
import CoachPage from '@/pages/CoachPage';
import NotFoundPage from '@/pages/NotFoundPage';
import DashboardRedirect from '@/pages/DashboardRedirect';
import ChooseModeFlow from '@/pages/auth/ChooseModeFlow';
import ModeSwitcher from '@/pages/common/ModeSwitcher';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import B2CDashboard from '@/pages/dashboards/B2CDashboard';
import B2BUserDashboard from '@/pages/dashboards/B2BUserDashboard';
import B2BAdminDashboard from '@/pages/dashboards/B2BAdminDashboard';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import EventsPage from '@/pages/EventsPage';
import Social from '@/pages/Social';
import SocialCocoonPage from '@/pages/SocialCocoonPage';

// Define routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModeFlow />,
  },
  {
    path: '/mode-switcher',
    element: <ModeSwitcher />,
  },
  {
    path: '/dashboard',
    element: <DashboardRedirect />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/events',
    element: <UnifiedLayout><EventsPage /></UnifiedLayout>,
  },
  {
    path: '/teams',
    element: <UnifiedLayout><TeamsPage /></UnifiedLayout>,
  },
  {
    path: '/journal',
    element: <UnifiedLayout><JournalPage /></UnifiedLayout>,
  },
  {
    path: '/optimization',
    element: <UnifiedLayout><OptimizationPage /></UnifiedLayout>,
  },
  {
    path: '/coach',
    element: <UnifiedLayout><CoachPage /></UnifiedLayout>,
  },
  {
    path: '/social',
    element: <Social />,
  },
  {
    path: '/social-cocoon',
    element: <UnifiedLayout><SocialCocoonPage /></UnifiedLayout>,
  },
  {
    path: '/b2c',
    element: <UnifiedLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2c" redirectTo="/choose-mode">
            <B2CDashboard />
          </ProtectedRouteWithMode>
        ),
      },
      {
        path: 'login',
        element: <LoginPage mode="b2c" />,
      },
      {
        path: 'register',
        element: <RegisterPage mode="b2c" />,
      },
      {
        path: 'journal',
        element: <JournalPage />,
      },
      {
        path: 'coach',
        element: <CoachPage />,
      },
    ],
  },
  {
    path: '/b2b/user',
    element: <UnifiedLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_user" redirectTo="/choose-mode">
            <B2BUserDashboard />
          </ProtectedRouteWithMode>
        ),
      },
      {
        path: 'login',
        element: <LoginPage mode="b2b_user" />,
      },
      {
        path: 'register',
        element: <RegisterPage mode="b2b_user" />,
      },
      {
        path: 'journal',
        element: <JournalPage />,
      },
      {
        path: 'coach',
        element: <CoachPage />,
      },
    ],
  },
  {
    path: '/b2b/admin',
    element: <UnifiedLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRouteWithMode requiredMode="b2b_admin" redirectTo="/choose-mode">
            <B2BAdminDashboard />
          </ProtectedRouteWithMode>
        ),
      },
      {
        path: 'login',
        element: <LoginPage mode="b2b_admin" />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'coach',
        element: <CoachPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Export default and named export for flexibility
export default routes;
