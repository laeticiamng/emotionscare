
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages publiques
const MarketingHome = lazy(() => import('@/pages/marketing/Home'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Pages d'erreur
const ErrorPage401 = lazy(() => import('@/pages/ErrorPage401'));
const ErrorPage403 = lazy(() => import('@/pages/ErrorPage403'));
const ErrorPage500 = lazy(() => import('@/pages/ErrorPage500'));

// Pages d'authentification
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

// Pages protégées B2C
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CMusicPage = lazy(() => import('@/pages/B2CMusicPage'));
const B2CCoachPage = lazy(() => import('@/pages/B2CCoachPage'));
const CoachChatPage = lazy(() => import('@/pages/CoachChatPage'));
const B2CVRPage = lazy(() => import('@/pages/B2CVRPage'));
const B2CPreferencesPage = lazy(() => import('@/pages/B2CPreferencesPage'));
const B2CSettingsPage = lazy(() => import('@/pages/B2CSettingsPage'));
const B2CCoconPage = lazy(() => import('@/pages/B2CCoconPage'));
const B2CSocialCoconPage = lazy(() => import('@/pages/B2CSocialCoconPage'));
const B2CGamificationPage = lazy(() => import('@/pages/B2CGamificationPage'));

// Pages protégées B2B User
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BUserJournalPage = lazy(() => import('@/pages/B2BUserJournalPage'));
const B2BUserScanPage = lazy(() => import('@/pages/B2BUserScanPage'));
const B2BUserMusicPage = lazy(() => import('@/pages/B2BUserMusicPage'));
const B2BUserCoachPage = lazy(() => import('@/pages/B2BUserCoachPage'));
const B2BUserVRPage = lazy(() => import('@/pages/B2BUserVRPage'));
const B2BUserPreferencesPage = lazy(() => import('@/pages/B2BUserPreferencesPage'));
const B2BUserSettingsPage = lazy(() => import('@/pages/B2BUserSettingsPage'));
const B2BUserCoconPage = lazy(() => import('@/pages/B2BUserCoconPage'));
const B2BUserSocialCoconPage = lazy(() => import('@/pages/B2BUserSocialCoconPage'));
const B2BUserGamificationPage = lazy(() => import('@/pages/B2BUserGamificationPage'));

// Pages protégées B2B Admin
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));
const B2BAdminJournalPage = lazy(() => import('@/pages/B2BAdminJournalPage'));
const B2BAdminScanPage = lazy(() => import('@/pages/B2BAdminScanPage'));
const B2BAdminMusicPage = lazy(() => import('@/pages/B2BAdminMusicPage'));
const B2BAdminTeamsPage = lazy(() => import('@/pages/B2BAdminTeamsPage'));
const B2BAdminReportsPage = lazy(() => import('@/pages/B2BAdminReportsPage'));
const B2BAdminEventsPage = lazy(() => import('@/pages/B2BAdminEventsPage'));
const B2BAdminSocialCoconPage = lazy(() => import('@/pages/B2BAdminSocialCoconPage'));
const B2BAdminOptimisationPage = lazy(() => import('@/pages/B2BAdminOptimisationPage'));
const B2BAdminSettingsPage = lazy(() => import('@/pages/B2BAdminSettingsPage'));

// Liste des routes pour les tests
export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/b2c/login',
  '/b2c/register',
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/admin/login',
  '/b2c/dashboard',
  '/b2c/journal',
  '/b2c/scan',
  '/b2c/music',
  '/b2c/coach',
  '/b2c/coach-chat',
  '/b2c/vr',
  '/b2c/preferences',
  '/b2c/settings',
  '/b2c/cocon',
  '/b2c/social-cocon',
  '/b2c/gamification',
  '/b2b/user/dashboard',
  '/b2b/user/journal',
  '/b2b/user/scan',
  '/b2b/user/music',
  '/b2b/user/coach',
  '/b2b/user/vr',
  '/b2b/user/preferences',
  '/b2b/user/settings',
  '/b2b/user/cocon',
  '/b2b/user/social-cocon',
  '/b2b/user/gamification',
  '/b2b/admin/dashboard',
  '/b2b/admin/journal',
  '/b2b/admin/scan',
  '/b2b/admin/music',
  '/b2b/admin/teams',
  '/b2b/admin/reports',
  '/b2b/admin/events',
  '/b2b/admin/social-cocon',
  '/b2b/admin/optimisation',
  '/b2b/admin/settings'
];

export const buildUnifiedRoutes = (): RouteObject[] => {
  console.log('🚀 Building unified routes...');

  // Importer le validateur de routes pour vérification
  import('../utils/routeValidator').catch(console.error);

  return [
    // Routes publiques (sans Layout pour éviter les contextes d'auth)
    {
      path: '/',
      element: <MarketingHome />
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />
    },
    {
      path: '/b2c/login',
      element: <B2CLoginPage />
    },
    {
      path: '/b2c/register',
      element: <B2CRegisterPage />
    },
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />
    },
    {
      path: '/b2b/user/login',
      element: <B2BUserLoginPage />
    },
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />
    },

    // Routes B2C protégées
    {
      path: '/b2c',
      element: (
        <ProtectedRoute requiredRole="b2c">
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2CDashboardPage />
        },
        {
          path: 'journal',
          element: <B2CJournalPage />
        },
        {
          path: 'scan',
          element: <B2CScanPage />
        },
        {
          path: 'music',
          element: <B2CMusicPage />
        },
        {
          path: 'coach',
          element: <B2CCoachPage />
        },
        {
          path: 'coach-chat',
          element: <CoachChatPage />
        },
        {
          path: 'vr',
          element: <B2CVRPage />
        },
        {
          path: 'preferences',
          element: <B2CPreferencesPage />
        },
        {
          path: 'settings',
          element: <B2CSettingsPage />
        },
        {
          path: 'cocon',
          element: <B2CCoconPage />
        },
        {
          path: 'social-cocon',
          element: <B2CSocialCoconPage />
        },
        {
          path: 'gamification',
          element: <B2CGamificationPage />
        }
      ]
    },

    // Routes B2B User protégées
    {
      path: '/b2b/user',
      element: (
        <ProtectedRoute requiredRole="b2b_user">
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2BUserDashboardPage />
        },
        {
          path: 'journal',
          element: <B2BUserJournalPage />
        },
        {
          path: 'scan',
          element: <B2BUserScanPage />
        },
        {
          path: 'music',
          element: <B2BUserMusicPage />
        },
        {
          path: 'coach',
          element: <B2BUserCoachPage />
        },
        {
          path: 'vr',
          element: <B2BUserVRPage />
        },
        {
          path: 'preferences',
          element: <B2BUserPreferencesPage />
        },
        {
          path: 'settings',
          element: <B2BUserSettingsPage />
        },
        {
          path: 'cocon',
          element: <B2BUserCoconPage />
        },
        {
          path: 'social-cocon',
          element: <B2BUserSocialCoconPage />
        },
        {
          path: 'gamification',
          element: <B2BUserGamificationPage />
        }
      ]
    },

    // Routes B2B Admin protégées
    {
      path: '/b2b/admin',
      element: (
        <ProtectedRoute requiredRole="b2b_admin">
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2BAdminDashboardPage />
        },
        {
          path: 'journal',
          element: <B2BAdminJournalPage />
        },
        {
          path: 'scan',
          element: <B2BAdminScanPage />
        },
        {
          path: 'music',
          element: <B2BAdminMusicPage />
        },
        {
          path: 'teams',
          element: <B2BAdminTeamsPage />
        },
        {
          path: 'reports',
          element: <B2BAdminReportsPage />
        },
        {
          path: 'events',
          element: <B2BAdminEventsPage />
        },
        {
          path: 'social-cocon',
          element: <B2BAdminSocialCoconPage />
        },
        {
          path: 'optimisation',
          element: <B2BAdminOptimisationPage />
        },
        {
          path: 'settings',
          element: <B2BAdminSettingsPage />
        }
      ]
    },

    // Pages d'erreur
    {
      path: '/401',
      element: <ErrorPage401 />
    },
    {
      path: '/403', 
      element: <ErrorPage403 />
    },
    {
      path: '/500',
      element: <ErrorPage500 />
    },

    // Route de validation des routes (dev uniquement)
    {
      path: '/route-validation',
      element: lazy(() => import('@/pages/RouteValidationPage'))
    },

    // Route 404
    {
      path: '*',
      element: <NotFoundPage />
    }
  ];
};
