
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OFFICIAL_ROUTES } from '@/routesManifest';

// Import lazy des pages existantes
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Import des pages B2C
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));

// Import des pages B2B
const B2BPage = lazy(() => import('@/pages/B2BPage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));

// Import des pages fonctionnelles
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

// Pages VR et immersives
const VRPage = lazy(() => import('@/pages/VRPage'));
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));

// Pages ambition et progression
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));

// Pages utilisateur
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const AccountDeletePage = lazy(() => import('@/pages/AccountDeletePage'));
const ExportCSVPage = lazy(() => import('@/pages/ExportCSVPage'));
const PrivacyTogglesPage = lazy(() => import('@/pages/PrivacyTogglesPage'));
const HealthCheckBadgePage = lazy(() => import('@/pages/HealthCheckBadgePage'));

// Pages B2B admin
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
const InnovationPage = lazy(() => import('@/pages/InnovationPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));

// Pages utilitaires
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));

export const unifiedRoutes: RouteObject[] = [
  // Routes publiques
  {
    path: OFFICIAL_ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: OFFICIAL_ROUTES.CHOOSE_MODE,
    element: <ChooseModePage />,
  },
  {
    path: OFFICIAL_ROUTES.ONBOARDING,
    element: <OnboardingPage />,
  },

  // Routes B2C
  {
    path: OFFICIAL_ROUTES.B2C_LOGIN,
    element: <B2CLoginPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2C_REGISTER,
    element: <B2CRegisterPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2C_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="b2c">
        <B2CDashboardPage />
      </ProtectedRoute>
    ),
  },

  // Routes B2B
  {
    path: OFFICIAL_ROUTES.B2B,
    element: <B2BPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2B_SELECTION,
    element: <B2BSelectionPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2B_USER_LOGIN,
    element: <B2BUserLoginPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2B_USER_REGISTER,
    element: <B2BUserRegisterPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2B_USER_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <B2BUserDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.B2B_ADMIN_LOGIN,
    element: <B2BAdminLoginPage />,
  },
  {
    path: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <B2BAdminDashboardPage />
      </ProtectedRoute>
    ),
  },

  // Routes mesure & adaptation immédiate
  {
    path: OFFICIAL_ROUTES.SCAN,
    element: (
      <ProtectedRoute>
        <ScanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.MUSIC,
    element: (
      <ProtectedRoute>
        <MusicPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.FLASH_GLOW,
    element: (
      <ProtectedRoute>
        <FlashGlowPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.BOSS_LEVEL_GRIT,
    element: (
      <ProtectedRoute>
        <BossLevelGritPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.MOOD_MIXER,
    element: (
      <ProtectedRoute>
        <MoodMixerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.BOUNCE_BACK_BATTLE,
    element: (
      <ProtectedRoute>
        <BounceBackBattlePage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.BREATHWORK,
    element: (
      <ProtectedRoute>
        <BreathworkPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.INSTANT_GLOW,
    element: (
      <ProtectedRoute>
        <InstantGlowPage />
      </ProtectedRoute>
    ),
  },

  // Routes communes
  {
    path: OFFICIAL_ROUTES.COACH,
    element: (
      <ProtectedRoute>
        <CoachPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.JOURNAL,
    element: (
      <ProtectedRoute>
        <JournalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: OFFICIAL_ROUTES.PREFERENCES,
    element: (
      <ProtectedRoute>
        <PreferencesPage />
      </ProtectedRoute>
    ),
  },
];
