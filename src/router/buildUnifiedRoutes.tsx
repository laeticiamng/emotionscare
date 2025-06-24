
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import B2BLayout from '@/layouts/B2BLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import UniversalErrorBoundary from '@/components/ErrorBoundary/UniversalErrorBoundary';

// Pages publiques
const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const Point20Page = lazy(() => import('@/pages/Point20Page'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Pages B2C
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

// Pages B2B User
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/B2BUserDashboardPage'));
const B2BUserScanPage = lazy(() => import('@/pages/b2b/user/B2BUserScanPage'));
const B2BUserCoachPage = lazy(() => import('@/pages/b2b/user/B2BUserCoachPage'));
const B2BUserMusicPage = lazy(() => import('@/pages/b2b/user/B2BUserMusicPage'));

// Pages B2B Admin
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

// Pages émotionnelles avancées
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

// Pages analytics
const InstantGlowPage = lazy(() => import('@/pages/analytics/InstantGlowPage'));
const WeeklyBarsPage = lazy(() => import('@/pages/analytics/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/analytics/HeatmapVibesPage'));
const BreathworkPage = lazy(() => import('@/pages/analytics/BreathworkPage'));

// Pages settings
const PrivacyTogglesPage = lazy(() => import('@/pages/settings/PrivacyTogglesPage'));
const ExportCSVPage = lazy(() => import('@/pages/settings/ExportCSVPage'));
const AccountDeletePage = lazy(() => import('@/pages/settings/AccountDeletePage'));
const ProfileSettingsPage = lazy(() => import('@/pages/settings/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/settings/ActivityHistoryPage'));

// Pages support
const HelpCenterPage = lazy(() => import('@/pages/support/HelpCenterPage'));
const HealthCheckBadgePage = lazy(() => import('@/pages/support/HealthCheckBadgePage'));

export function buildUnifiedRoutes() {
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
      element: <OnboardingPage />,
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
          path: 'feedback',
          element: <FeedbackPage />,
          errorElement: <UniversalErrorBoundary />
        }
      ],
      errorElement: <UniversalErrorBoundary />
    },

    // Routes communes fonctionnelles
    {
      path: '/scan',
      element: <Navigate to="/b2c/scan" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/music',
      element: <Navigate to="/b2c/music" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/coach',
      element: <Navigate to="/b2c/coach" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/journal',
      element: <Navigate to="/b2c/journal" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/vr',
      element: <Navigate to="/b2c/vr" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/preferences',
      element: <Navigate to="/b2c/settings" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/gamification',
      element: <Navigate to="/b2c/gamification" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/social-cocon',
      element: <Navigate to="/b2c/social-cocon" replace />,
      errorElement: <UniversalErrorBoundary />
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

    // Routes settings
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

    // Routes admin
    {
      path: '/teams',
      element: <Navigate to="/b2b/admin/teams" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/reports',
      element: <Navigate to="/b2b/admin/reports" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/events',
      element: <Navigate to="/b2b/admin/events" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/optimisation',
      element: <Navigate to="/b2b/admin/optimisation" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/settings',
      element: <Navigate to="/b2b/admin/settings" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/notifications',
      element: <Navigate to="/b2b/admin/notifications" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/security',
      element: <Navigate to="/b2b/admin/security" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/audit',
      element: <Navigate to="/b2b/admin/audit" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/accessibility',
      element: <Navigate to="/b2b/admin/accessibility" replace />,
      errorElement: <UniversalErrorBoundary />
    },
    {
      path: '/feedback',
      element: <Navigate to="/b2b/admin/feedback" replace />,
      errorElement: <UniversalErrorBoundary />
    },

    // Route catch-all
    {
      path: '*',
      element: <Navigate to="/" replace />,
      errorElement: <UniversalErrorBoundary />
    }
  ];
}
