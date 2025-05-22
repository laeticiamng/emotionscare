
import React from 'react';

// Layouts
import ProtectedLayout from '@/components/ProtectedLayout';
import Layout from '@/components/Layout';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

// Public Pages
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import ModeSwitcher from '@/pages/common/ModeSwitcher';
import B2BSelection from '@/pages/b2b/Selection';
import NotFoundPage from '@/pages/NotFoundPage';

// Auth Pages
import B2CLogin from '@/pages/b2c/Login';
import B2BUserLogin from '@/pages/b2b/user/Login';
import B2BAdminLogin from '@/pages/b2b/admin/Login';

// Dashboard Pages
import DashboardRedirect from '@/pages/DashboardRedirect';
import Dashboard from '@/pages/Dashboard';
import B2CDashboardPage from '@/pages/b2c/DashboardPage';
import B2BUserDashboardPage from '@/pages/b2b/user/DashboardPage';
import B2BAdminDashboardPage from '@/pages/b2b/admin/DashboardPage';

// Feature Pages
import UnifiedSettingsPage from '@/pages/UnifiedSettingsPage';
import B2CJournalPage from '@/pages/b2c/Journal';
import B2CAudioPage from '@/pages/b2c/Audio';
import B2CMusicPage from '@/pages/b2c/Music';
import B2CCoachPage from '@/pages/b2c/Coach';

// Redirect Components
import Journal from '@/pages/Journal';
import Audio from '@/pages/Audio';
import Music from '@/pages/Music';
import Coach from '@/pages/Coach';

const routes = [
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
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
        path: '/choose-mode',
        element: <ModeSwitcher />
      },
      {
        path: '/b2b/selection',
        element: <B2BSelection />
      },
      {
        path: '/b2c/login',
        element: <B2CLogin />
      },
      {
        path: '/b2b/user/login',
        element: <B2BUserLogin />
      },
      {
        path: '/b2b/admin/login',
        element: <B2BAdminLogin />
      },
      {
        element: <UnifiedLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardRedirect />
          },
          {
            path: '/b2c/dashboard',
            element: <B2CDashboardPage />
          },
          {
            path: '/b2b/user/dashboard',
            element: <B2BUserDashboardPage />
          },
          {
            path: '/b2b/admin/dashboard',
            element: <B2BAdminDashboardPage />
          },
          {
            path: '/settings',
            element: <UnifiedSettingsPage />
          },
          // Feature redirect pages
          {
            path: '/journal',
            element: <Journal />
          },
          {
            path: '/audio',
            element: <Audio />
          },
          {
            path: '/music',
            element: <Music />
          },
          {
            path: '/coach',
            element: <Coach />
          },
          // Mode-specific feature pages
          {
            path: '/b2c/journal',
            element: <B2CJournalPage />
          },
          {
            path: '/b2c/audio',
            element: <B2CAudioPage />
          },
          {
            path: '/b2c/music',
            element: <B2CMusicPage />
          },
          {
            path: '/b2c/coach',
            element: <B2CCoachPage />
          },
          // B2B user feature pages will be similar to B2C pages but with team features
          {
            path: '/b2b/user/journal',
            element: <B2CJournalPage />
          },
          {
            path: '/b2b/user/audio',
            element: <B2CAudioPage />
          },
          {
            path: '/b2b/user/music',
            element: <B2CMusicPage />
          },
          {
            path: '/b2b/user/coach',
            element: <B2CCoachPage />
          },
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
