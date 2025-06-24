import React, { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import B2BLayout from '@/layouts/B2BLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import UniversalErrorBoundary from '@/components/ErrorBoundary/UniversalErrorBoundary';

// Définition des pages lazy-loaded
const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const B2COnboardingPage = lazy(() => import('@/pages/B2COnboardingPage'));

const B2CLoginPage = lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));
const B2CJournalPage = lazy(() => import('@/pages/b2c/B2CJournalPage'));
const B2CScanPage = lazy(() => import('@/pages/b2c/B2CScanPage'));
const B2CMusicPage = lazy(() => import('@/pages/b2c/B2CMusicPage'));
const B2CCoachPage = lazy(() => import('@/pages/b2c/B2CCoachPage'));
const B2CVRPage = lazy(() => import('@/pages/b2c/B2CVRPage'));
const B2CGamificationPage = lazy(() => import('@/pages/b2c/B2CGamificationPage'));
const B2CSocialPage = lazy(() => import('@/pages/b2c/B2CSocialPage'));
const B2CSettingsPage = lazy(() => import('@/pages/b2c/B2CSettingsPage'));

const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/B2BUserDashboardPage'));
const B2BUserScanPage = lazy(() => import('@/pages/b2b/user/B2BUserScanPage'));
const B2BUserCoachPage = lazy(() => import('@/pages/b2b/user/B2BUserCoachPage'));
const B2BUserMusicPage = lazy(() => import('@/pages/b2b/user/B2BUserMusicPage'));

const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/B2BAdminDashboardPage'));
const TeamsPage = lazy(() => import('@/pages/b2b/admin/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/b2b/admin/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/b2b/admin/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/b2b/admin/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/b2b/admin/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/b2b/admin/NotificationsPage'));
const SecurityPage = lazy(() => import('@/pages/b2b/admin/SecurityPage'));
const PrivacyPage = lazy(() => import('@/pages/b2b/admin/PrivacyPage'));
const AuditPage = lazy(() => import('@/pages/b2b/admin/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/b2b/admin/AccessibilityPage'));
const InnovationPage = lazy(() => import('@/pages/b2b/admin/InnovationPage'));
const FeedbackPage = lazy(() => import('@/pages/b2b/admin/FeedbackPage'));

const BossLevelGritPage = lazy(() => import('@/pages/emotional/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/emotional/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/emotional/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/emotional/BounceBackBattlePage'));
const StorySynthLabPage = lazy(() => import('@/pages/emotional/StorySynthLabPage'));
const FlashGlowPage = lazy(() => import('@/pages/emotional/FlashGlowPage'));
const ARFiltersPage = lazy(() => import('@/pages/emotional/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/emotional/BubbleBeatPage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/emotional/ScreenSilkBreakPage'));
const VRGalactiquePage = lazy(() => import('@/pages/emotional/VRGalactiquePage'));

const InstantGlowPage = lazy(() => import('@/pages/analytics/InstantGlowPage'));
const WeeklyBarsPage = lazy(() => import('@/pages/analytics/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/analytics/HeatmapVibesPage'));
const BreathworkPage = lazy(() => import('@/pages/analytics/BreathworkPage'));

const PrivacyTogglesPage = lazy(() => import('@/pages/settings/PrivacyTogglesPage'));
const ExportCSVPage = lazy(() => import('@/pages/settings/ExportCSVPage'));
const AccountDeletePage = lazy(() => import('@/pages/settings/AccountDeletePage'));
const ProfileSettingsPage = lazy(() => import('@/pages/settings/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/settings/ActivityHistoryPage'));

const HelpCenterPage = lazy(() => import('@/pages/support/HelpCenterPage'));
const HealthCheckBadgePage = lazy(() => import('@/pages/support/HealthCheckBadgePage'));

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
      ]
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
          <B2BLayout />
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
      ]
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
      ]
    },

    // Routes modules émotionnels
    {
      path: '/boss-level-grit',
      element: <BossLevelGritPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/mood-mixer',
      element: <MoodMixerPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/ambition-arcade',
      element: <AmbitionArcadePage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/bounce-back-battle',
      element: <BounceBackBattlePage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/story-synth-lab',
      element: <StorySynthLabPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/flash-glow',
      element: <FlashGlowPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/ar-filters',
      element: <ARFiltersPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/bubble-beat',
      element: <BubbleBeatPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/screen-silk-break',
      element: <ScreenSilkBreakPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/vr-galactique',
      element: <VRGalactiquePage />,
      errorElement: <UniversalErrorBoundary />
    },

    // Routes analytics
    {
      path: '/instant-glow',
      element: <InstantGlowPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/weekly-bars',
      element: <WeeklyBarsPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/heatmap-vibes',
      element: <HeatmapVibesPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/breathwork',
      element: <BreathworkPage />,
      errorElement: <UniversalErrorBoundary />
    },

    // Routes settings/privacy
    {
      path: '/privacy-toggles',
      element: <PrivacyTogglesPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/export-csv',
      element: <ExportCSVPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/account/delete',
      element: <AccountDeletePage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/profile-settings',
      element: <ProfileSettingsPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/activity-history',
      element: <ActivityHistoryPage />,
      errorElement: <UniversalErrorBoundary />
    },

    // Routes support
    {
      path: '/help-center',
      element: <HelpCenterPage />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/health-check-badge',
      element: <HealthCheckBadgePage />,
      errorElement: <UniversalErrorBoundary />
    },

    // Route 404
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ];
}

// Export pour les tests
export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode',
  '/onboarding',
  '/b2b/selection',
  '/b2c/login',
  '/b2c/register',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/admin/login',
  '/b2c/dashboard',
  '/b2b/user/dashboard',
  '/b2b/admin/dashboard',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/vr',
  '/preferences',
  '/gamification',
  '/social-cocon',
  '/boss-level-grit',
  '/mood-mixer',
  '/ambition-arcade',
  '/bounce-back-battle',
  '/story-synth-lab',
  '/flash-glow',
  '/ar-filters',
  '/bubble-beat',
  '/screen-silk-break',
  '/vr-galactique',
  '/instant-glow',
  '/weekly-bars',
  '/heatmap-vibes',
  '/breathwork',
  '/privacy-toggles',
  '/export-csv',
  '/account/delete',
  '/health-check-badge',
  '/help-center',
  '/profile-settings',
  '/activity-history',
  '/teams',
  '/reports',
  '/events',
  '/optimisation',
  '/settings',
  '/notifications',
  '/security',
  '/audit',
  '/accessibility',
  '/feedback'
];

export function validateRoutesManifest() {
  const routes = ROUTE_MANIFEST;
  const uniqueRoutes = new Set(routes);
  
  return {
    valid: routes.length === uniqueRoutes.size && routes.length === 52,
    errors: routes.length !== uniqueRoutes.size ? ['Duplicate routes found'] : 
             routes.length !== 52 ? [`Expected 52 routes, found ${routes.length}`] : []
  };
}
