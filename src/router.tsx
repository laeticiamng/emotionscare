
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
import B2CEmotionProgressPage from '@/pages/b2c/EmotionProgressPage';
import B2CVR from '@/pages/b2c/VR';
import B2CGamification from '@/pages/b2c/Gamification';
import B2CSocial from '@/pages/b2c/Social';

// B2B User Feature Pages
import B2BUserGamification from '@/pages/b2b/user/Gamification';
import B2BUserPreferences from '@/pages/b2b/user/Preferences';
import B2BUserMusicCreate from '@/pages/b2b/user/MusicCreate';
import B2BUserMusicPreferences from '@/pages/b2b/user/MusicPreferences';

// B2B Admin Feature Pages
import B2BAdminEvents from '@/pages/b2b/admin/Events';
import B2BAdminSocialCocon from '@/pages/b2b/admin/SocialCocon';

// Redirect Components
import Journal from '@/pages/Journal';
import Audio from '@/pages/Audio';
import Music from '@/pages/Music';
import Coach from '@/pages/Coach';
import Progress from '@/pages/Progress';
import VR from '@/pages/VR';
import Social from '@/pages/Social';
import Gamification from '@/pages/Gamification';

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
          // Dashboards
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
          // Common features
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
          // B2C specific feature pages
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
          {
            path: '/b2c/progress',
            element: <B2CEmotionProgressPage />
          },
          {
            path: '/b2c/vr',
            element: <B2CVR />
          },
          {
            path: '/b2c/gamification',
            element: <B2CGamification />
          },
          {
            path: '/b2c/social',
            element: <B2CSocial />
          },
          // B2B user feature pages
          {
            path: '/b2b/user/journal',
            element: <B2CJournalPage /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/audio',
            element: <B2CAudioPage /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/music',
            element: <B2CMusicPage /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/music/create',
            element: <B2BUserMusicCreate />
          },
          {
            path: '/b2b/user/music/preferences',
            element: <B2BUserMusicPreferences />
          },
          {
            path: '/b2b/user/coach',
            element: <B2CCoachPage /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/progress',
            element: <B2CEmotionProgressPage /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/vr',
            element: <B2CVR /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/gamification',
            element: <B2BUserGamification />
          },
          {
            path: '/b2b/user/social',
            element: <B2CSocial /> // Réutilisation du composant B2C avec une future adaptation
          },
          {
            path: '/b2b/user/preferences',
            element: <B2BUserPreferences />
          },
          // B2B Admin feature pages
          {
            path: '/b2b/admin/events',
            element: <B2BAdminEvents />
          },
          {
            path: '/b2b/admin/social',
            element: <B2BAdminSocialCocon />
          }
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
