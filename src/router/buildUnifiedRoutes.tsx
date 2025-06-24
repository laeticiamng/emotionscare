import React from 'react';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import B2BLayout from '@/layouts/B2BLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UniversalErrorBoundary } from '@/components/ErrorBoundary/UniversalErrorBoundary';

// Lazy loading des pages pour optimiser le chargement initial
import {
  B2CLoginPage,
  B2CRegisterPage,
  B2CDashboardPage,
  B2COnboardingPage,
  B2BUserLoginPage,
  B2BUserRegisterPage,
  B2BUserDashboardPage,
  B2BAdminLoginPage,
  B2BAdminDashboardPage,
} from '@/utils/lazyComponents';

// Pages publiques
import ImmersiveHome from '@/pages/ImmersiveHome';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import Point20Page from '@/pages/Point20Page';

// Pages B2C
import B2CJournalPage from '@/pages/b2c/JournalPage';
import B2CMusicPage from '@/pages/b2c/MusicPage';
import B2CScanPage from '@/pages/b2c/ScanPage';
import B2CCoachPage from '@/pages/b2c/CoachPage';
import B2CVRPage from '@/pages/b2c/VRPage';
import B2CGamificationPage from '@/pages/b2c/GamificationPage';
import B2CSocialPage from '@/pages/b2c/SocialPage';
import B2CSettingsPage from '@/pages/b2c/SettingsPage';

// Pages B2B User
import B2BUserScanPage from '@/pages/b2b/user/ScanPage';
import B2BUserCoachPage from '@/pages/b2b/user/CoachPage';
import B2BUserMusicPage from '@/pages/b2b/user/MusicPage';

// Pages B2B Admin
import TeamsPage from '@/pages/b2b/admin/TeamsPage';
import ReportsPage from '@/pages/b2b/admin/ReportsPage';
import EventsPage from '@/pages/b2b/admin/EventsPage';
import OptimisationPage from '@/pages/b2b/admin/OptimisationPage';
import SettingsPage from '@/pages/b2b/admin/SettingsPage';
import NotificationsPage from '@/pages/b2b/admin/NotificationsPage';
import SecurityPage from '@/pages/b2b/admin/SecurityPage';
import PrivacyPage from '@/pages/b2b/admin/PrivacyPage';
import AuditPage from '@/pages/b2b/admin/AuditPage';
import AccessibilityPage from '@/pages/b2b/admin/AccessibilityPage';
import InnovationPage from '@/pages/b2b/admin/InnovationPage';
import FeedbackPage from '@/pages/b2b/admin/FeedbackPage';

// Nouvelles pages des modules émotionnels
import BossLevelGritPage from '@/pages/modules/BossLevelGritPage';
import MoodMixerPage from '@/pages/modules/MoodMixerPage';
import AmbitionArcadePage from '@/pages/modules/AmbitionArcadePage';
import BounceBackBattlePage from '@/pages/modules/BounceBackBattlePage';
import StorySynthLabPage from '@/pages/modules/StorySynthLabPage';
import FlashGlowPage from '@/pages/modules/FlashGlowPage';
import ARFiltersPage from '@/pages/modules/ARFiltersPage';
import BubbleBeatPage from '@/pages/modules/BubbleBeatPage';
import ScreenSilkBreakPage from '@/pages/modules/ScreenSilkBreakPage';
import VRGalactiquePage from '@/pages/modules/VRGalactiquePage';

// Nouvelles pages d'analytics
import InstantGlowPage from '@/pages/analytics/InstantGlowPage';
import WeeklyBarsPage from '@/pages/analytics/WeeklyBarsPage';
import HeatmapVibesPage from '@/pages/analytics/HeatmapVibesPage';
import BreathworkPage from '@/pages/analytics/BreathworkPage';

// Nouvelles pages de fonctionnalités
import PrivacyTogglesPage from '@/pages/settings/PrivacyTogglesPage';
import ExportCSVPage from '@/pages/settings/ExportCSVPage';
import AccountDeletePage from '@/pages/settings/AccountDeletePage';

// Pages manquantes (création simple)
import HelpCenterPage from '@/pages/support/HelpCenterPage';
import ProfileSettingsPage from '@/pages/settings/ProfileSettingsPage';
import ActivityHistoryPage from '@/pages/user/ActivityHistoryPage';
import HealthCheckBadgePage from '@/pages/health/HealthCheckBadgePage';

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    // Routes publiques
    {
      path: '/',
      element: <ImmersiveHome />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/point20',
      element: <Point20Page />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/onboarding',
      element: <B2COnboardingPage />,
      errorElement: <UniversalErrorBoundary />
    },
    
    // Routes B2C
    {
      path: '/b2c/login',
      element: <B2CLoginPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2c/register',
      element: <B2CRegisterPage />,
      errorElement: <UniversalErrorBoundary />
    },
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
          element: <B2CDashboardPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'journal',
          element: <B2CJournalPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'scan',
          element: <B2CScanPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'music',
          element: <B2CMusicPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'coach',
          element: <B2CCoachPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'vr',
          element: <B2CVRPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'gamification',
          element: <B2CGamificationPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'social-cocon',
          element: <B2CSocialPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'settings',
          element: <B2CSettingsPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ],
      errorElement: <UniversalErrorBoundary />
    },
    
    // Routes B2B User
    {
      path: '/b2b/user/login',
      element: <B2BUserLoginPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/user/register',
      element: <B2BUserRegisterPage />,
      errorElement: <UniversalErrorBoundary />
    },
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
          element: <B2BUserDashboardPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'scan',
          element: <B2BUserScanPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'coach',
          element: <B2BUserCoachPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'music',
          element: <B2BUserMusicPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ],
      errorElement: <UniversalErrorBoundary />
    },
    
    // Routes B2B Admin
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/b2b/admin',
      element: (
        <ProtectedRoute requiredRole="b2b_admin">
          <B2BLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'dashboard',
          element: <B2BAdminDashboardPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'teams',
          element: <TeamsPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'reports',
          element: <ReportsPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'events',
          element: <EventsPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'optimisation',
          element: <OptimisationPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'settings',
          element: <SettingsPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'notifications',
          element: <NotificationsPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'security',
          element: <SecurityPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'privacy',
          element: <PrivacyPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'audit',
          element: <AuditPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'accessibility',
          element: <AccessibilityPage />,
          errorElement: <UniversalErrorBoundary />
        },
        {
          path: 'innovation',
          element: <InnovationPage />,
          errorElement: <UniversalErrorBoundary />
        },
         {
          path: 'feedback',
          element: <FeedbackPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ],
      errorElement: <UniversalErrorBoundary />
    },
    
    // NOUVELLES ROUTES - Modules émotionnels (accessibles selon le rôle)
    {
      path: '/boss-level-grit',
      element: (
        <ProtectedRoute>
          <Layout>
            <BossLevelGritPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/mood-mixer',
      element: (
        <ProtectedRoute>
          <Layout>
            <MoodMixerPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/ambition-arcade',
      element: (
        <ProtectedRoute>
          <Layout>
            <AmbitionArcadePage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/bounce-back-battle',
      element: (
        <ProtectedRoute>
          <Layout>
            <BounceBackBattlePage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/story-synth-lab',
      element: (
        <ProtectedRoute>
          <Layout>
            <StorySynthLabPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/flash-glow',
      element: (
        <ProtectedRoute>
          <Layout>
            <FlashGlowPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/ar-filters',
      element: (
        <ProtectedRoute>
          <Layout>
            <ARFiltersPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/bubble-beat',
      element: (
        <ProtectedRoute>
          <Layout>
            <BubbleBeatPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/screen-silk-break',
      element: (
        <ProtectedRoute>
          <Layout>
            <ScreenSilkBreakPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/vr-galactique',
      element: (
        <ProtectedRoute>
          <Layout>
            <VRGalactiquePage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },

    // NOUVELLES ROUTES - Analytics avancés
    {
      path: '/instant-glow',
      element: (
        <ProtectedRoute>
          <Layout>
            <InstantGlowPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/weekly-bars',
      element: (
        <ProtectedRoute>
          <Layout>
            <WeeklyBarsPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/heatmap-vibes',
      element: (
        <ProtectedRoute>
          <Layout>
            <HeatmapVibesPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/breathwork',
      element: (
        <ProtectedRoute>
          <Layout>
            <BreathworkPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },

    // NOUVELLES ROUTES - Fonctionnalités spécialisées
    {
      path: '/privacy-toggles',
      element: (
        <ProtectedRoute>
          <Layout>
            <PrivacyTogglesPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/export-csv',
      element: (
        <ProtectedRoute>
          <Layout>
            <ExportCSVPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/account/delete',
      element: (
        <ProtectedRoute>
          <Layout>
            <AccountDeletePage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/health-check-badge',
      element: (
        <ProtectedRoute>
          <Layout>
            <HealthCheckBadgePage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/help-center',
      element: (
        <ProtectedRoute>
          <Layout>
            <HelpCenterPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/profile-settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <ProfileSettingsPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/activity-history',
      element: (
        <ProtectedRoute>
          <Layout>
            <ActivityHistoryPage />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <UniversalErrorBoundary />
    },

    // Route pour /b2b (redirection vers /b2b/selection)
    {
      path: '/b2b',
      element: <Navigate to="/b2b/selection" replace />
    },

    // Fallback 404
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ];
}
