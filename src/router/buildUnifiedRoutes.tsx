
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

// Pages Fun-First B2C
const B2CBubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const B2CFlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const B2CBossLevelGritPage = lazy(() => import('@/pages/B2CBossLevelGritPage'));
const B2CMoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const B2CBounceBackBattlePage = lazy(() => import('@/pages/B2CBounceBackBattlePage'));
const B2CBreathworkPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const B2CInstantGlowPage = lazy(() => import('@/pages/B2CInstantGlowPage'));
const B2CVRGalactiquePage = lazy(() => import('@/pages/B2CVRGalactiquePage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/B2CScreenSilkBreakPage'));
const B2CStorySynthLabPage = lazy(() => import('@/pages/B2CStorySynthLabPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/B2CARFiltersPage'));
const B2CAmbitionArcadePage = lazy(() => import('@/pages/B2CAmbitionArcadePage'));
const B2CWeeklyBarsPage = lazy(() => import('@/pages/B2CWeeklyBarsPage'));
const B2CHeatmapVibesPage = lazy(() => import('@/pages/B2CHeatmapVibesPage'));

// Pages Paramètres & Compte B2C
const B2CProfileSettingsPage = lazy(() => import('@/pages/B2CProfileSettingsPage'));
const B2CActivityHistoryPage = lazy(() => import('@/pages/B2CActivityHistoryPage'));
const B2CNotificationsPage = lazy(() => import('@/pages/B2CNotificationsPage'));
const B2CFeedbackPage = lazy(() => import('@/pages/B2CFeedbackPage'));
const B2CSettingsRGPDPage = lazy(() => import('@/pages/B2CSettingsRGPDPage'));
const B2CAccountDeletePage = lazy(() => import('@/pages/B2CAccountDeletePage'));
const B2CExportCSVPage = lazy(() => import('@/pages/B2CExportCSVPage'));
const B2CPrivacyTogglesPage = lazy(() => import('@/pages/B2CPrivacyTogglesPage'));
const B2CHealthCheckBadgePage = lazy(() => import('@/pages/B2CHealthCheckBadgePage'));

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
  // Routes publiques
  '/', '/choose-mode',
  // Auth routes
  '/b2c/login', '/b2c/register', '/b2b/selection', '/b2b/user/login', '/b2b/admin/login',
  // Error routes
  '/401', '/403', '/500',
  // B2C routes principales
  '/b2c/dashboard', '/b2c/journal', '/b2c/scan', '/b2c/music', '/b2c/coach', '/b2c/coach-chat', '/b2c/vr', '/b2c/preferences', '/b2c/settings', '/b2c/cocon', '/b2c/social-cocon', '/b2c/gamification',
  // B2C Fun-First routes
  '/b2c/bubble-beat', '/b2c/flash-glow', '/b2c/boss-level-grit', '/b2c/mood-mixer', '/b2c/bounce-back-battle', '/b2c/breathwork', '/b2c/instant-glow', '/b2c/vr-galactique', '/b2c/screen-silk-break', '/b2c/story-synth-lab', '/b2c/ar-filters', '/b2c/ambition-arcade', '/b2c/weekly-bars', '/b2c/heatmap-vibes',
  // B2C Paramètres routes
  '/b2c/profile-settings', '/b2c/activity-history', '/b2c/notifications', '/b2c/feedback', '/b2c/settings-rgpd', '/b2c/account-delete', '/b2c/export-csv', '/b2c/privacy-toggles', '/b2c/health-check-badge',
  // B2B User routes
  '/b2b/user/dashboard', '/b2b/user/journal', '/b2b/user/scan', '/b2b/user/music', '/b2b/user/coach', '/b2b/user/vr', '/b2b/user/preferences', '/b2b/user/settings', '/b2b/user/cocon', '/b2b/user/social-cocon', '/b2b/user/gamification',
  // B2B Admin routes
  '/b2b/admin/dashboard', '/b2b/admin/journal', '/b2b/admin/scan', '/b2b/admin/music', '/b2b/admin/teams', '/b2b/admin/reports', '/b2b/admin/events', '/b2b/admin/social-cocon', '/b2b/admin/optimisation', '/b2b/admin/settings', '/b2b/admin/security', '/b2b/admin/audit', '/b2b/admin/accessibility'
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
        },
        // Fun-First routes
        {
          path: 'bubble-beat',
          element: <B2CBubbleBeatPage />
        },
        {
          path: 'flash-glow',
          element: <B2CFlashGlowPage />
        },
        {
          path: 'boss-level-grit',
          element: <B2CBossLevelGritPage />
        },
        {
          path: 'mood-mixer',
          element: <B2CMoodMixerPage />
        },
        {
          path: 'bounce-back-battle',
          element: <B2CBounceBackBattlePage />
        },
        {
          path: 'breathwork',
          element: <B2CBreathworkPage />
        },
        {
          path: 'instant-glow',
          element: <B2CInstantGlowPage />
        },
        {
          path: 'vr-galactique',
          element: <B2CVRGalactiquePage />
        },
        {
          path: 'screen-silk-break',
          element: <B2CScreenSilkBreakPage />
        },
        {
          path: 'story-synth-lab',
          element: <B2CStorySynthLabPage />
        },
        {
          path: 'ar-filters',
          element: <B2CARFiltersPage />
        },
        {
          path: 'ambition-arcade',
          element: <B2CAmbitionArcadePage />
        },
        {
          path: 'weekly-bars',
          element: <B2CWeeklyBarsPage />
        },
        {
          path: 'heatmap-vibes',
          element: <B2CHeatmapVibesPage />
        },
        // Paramètres & Compte routes
        {
          path: 'profile-settings',
          element: <B2CProfileSettingsPage />
        },
        {
          path: 'activity-history',
          element: <B2CActivityHistoryPage />
        },
        {
          path: 'notifications',
          element: <B2CNotificationsPage />
        },
        {
          path: 'feedback',
          element: <B2CFeedbackPage />
        },
        {
          path: 'settings-rgpd',
          element: <B2CSettingsRGPDPage />
        },
        {
          path: 'account-delete',
          element: <B2CAccountDeletePage />
        },
        {
          path: 'export-csv',
          element: <B2CExportCSVPage />
        },
        {
          path: 'privacy-toggles',
          element: <B2CPrivacyTogglesPage />
        },
        {
          path: 'health-check-badge',
          element: <B2CHealthCheckBadgePage />
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
