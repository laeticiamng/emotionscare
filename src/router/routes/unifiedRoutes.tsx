
import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import LoadingAnimation from '@/components/ui/loading-animation';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

// Lazy loading des pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Pages B2C
const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

// Pages B2B User
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));

// Pages B2B Admin
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

// Pages de fonctionnalités
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Pages modules fun-first
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

// Pages analytics & data
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));

// Pages paramètres & compte
const PrivacyTogglesPage = lazy(() => import('@/pages/PrivacyTogglesPage'));
const DataExportPage = lazy(() => import('@/pages/DataExportPage'));
const AccountDeletionPage = lazy(() => import('@/pages/AccountDeletionPage'));
const PlatformStatusPage = lazy(() => import('@/pages/PlatformStatusPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));
const InAppFeedbackPage = lazy(() => import('@/pages/InAppFeedbackPage'));

// Pages spéciales
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const AuditTicketP0Page = lazy(() => import('@/pages/AuditTicketP0Page'));
const PlatformTestPage = lazy(() => import('@/pages/testing/PlatformTestPage'));

// Pages administration B2B
const SecurityDashboardPage = lazy(() => import('@/pages/SecurityDashboardPage'));
const SystemAuditPage = lazy(() => import('@/pages/SystemAuditPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));

// Composant de chargement
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingAnimation text="Chargement de la page..." />
  </div>
);

// Wrapper avec Suspense et ErrorBoundary
const withSuspenseAndErrorBoundary = (Component: React.ComponentType) => () => (
  <EnhancedErrorBoundary>
    <Suspense fallback={<PageLoadingFallback />}>
      <Component />
    </Suspense>
  </EnhancedErrorBoundary>
);

// Configuration des routes unifiées
export const unifiedRoutes: RouteObject[] = [
  // Routes publiques
  {
    path: UNIFIED_ROUTES.HOME,
    Component: withSuspenseAndErrorBoundary(HomePage),
  },
  {
    path: UNIFIED_ROUTES.CHOOSE_MODE,
    Component: withSuspenseAndErrorBoundary(ChooseModePage),
  },
  {
    path: UNIFIED_ROUTES.B2B_SELECTION,
    Component: withSuspenseAndErrorBoundary(B2BSelectionPage),
  },

  // Routes B2C
  {
    path: UNIFIED_ROUTES.B2C_LOGIN,
    Component: withSuspenseAndErrorBoundary(B2CLoginPage),
  },
  {
    path: UNIFIED_ROUTES.B2C_REGISTER,
    Component: withSuspenseAndErrorBoundary(B2CRegisterPage),
  },
  {
    path: UNIFIED_ROUTES.B2C_DASHBOARD,
    Component: withSuspenseAndErrorBoundary(B2CDashboardPage),
  },

  // Routes B2B User
  {
    path: UNIFIED_ROUTES.B2B_USER_LOGIN,
    Component: withSuspenseAndErrorBoundary(B2BUserLoginPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_REGISTER,
    Component: withSuspenseAndErrorBoundary(B2BUserRegisterPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_USER_DASHBOARD,
    Component: withSuspenseAndErrorBoundary(B2BUserDashboardPage),
  },

  // Routes B2B Admin
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_LOGIN,
    Component: withSuspenseAndErrorBoundary(B2BAdminLoginPage),
  },
  {
    path: UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD,
    Component: withSuspenseAndErrorBoundary(B2BAdminDashboardPage),
  },

  // Routes de fonctionnalités communes
  {
    path: UNIFIED_ROUTES.SCAN,
    Component: withSuspenseAndErrorBoundary(ScanPage),
  },
  {
    path: UNIFIED_ROUTES.MUSIC,
    Component: withSuspenseAndErrorBoundary(MusicPage),
  },
  {
    path: UNIFIED_ROUTES.COACH,
    Component: withSuspenseAndErrorBoundary(CoachPage),
  },
  {
    path: UNIFIED_ROUTES.JOURNAL,
    Component: withSuspenseAndErrorBoundary(JournalPage),
  },
  {
    path: UNIFIED_ROUTES.VR,
    Component: withSuspenseAndErrorBoundary(VRPage),
  },
  {
    path: UNIFIED_ROUTES.PREFERENCES,
    Component: withSuspenseAndErrorBoundary(PreferencesPage),
  },
  {
    path: UNIFIED_ROUTES.GAMIFICATION,
    Component: withSuspenseAndErrorBoundary(GamificationPage),
  },
  {
    path: UNIFIED_ROUTES.SOCIAL_COCON,
    Component: withSuspenseAndErrorBoundary(SocialCoconPage),
  },

  // Routes administrateur
  {
    path: UNIFIED_ROUTES.TEAMS,
    Component: withSuspenseAndErrorBoundary(TeamsPage),
  },
  {
    path: UNIFIED_ROUTES.REPORTS,
    Component: withSuspenseAndErrorBoundary(ReportsPage),
  },
  {
    path: UNIFIED_ROUTES.EVENTS,
    Component: withSuspenseAndErrorBoundary(EventsPage),
  },
  {
    path: UNIFIED_ROUTES.OPTIMISATION,
    Component: withSuspenseAndErrorBoundary(OptimisationPage),
  },
  {
    path: UNIFIED_ROUTES.SETTINGS,
    Component: withSuspenseAndErrorBoundary(SettingsPage),
  },

  // Modules fun-first avec IA
  {
    path: UNIFIED_ROUTES.BOSS_LEVEL_GRIT,
    Component: withSuspenseAndErrorBoundary(BossLevelGritPage),
  },
  {
    path: UNIFIED_ROUTES.MOOD_MIXER,
    Component: withSuspenseAndErrorBoundary(MoodMixerPage),
  },
  {
    path: UNIFIED_ROUTES.AMBITION_ARCADE,
    Component: withSuspenseAndErrorBoundary(AmbitionArcadePage),
  },
  {
    path: UNIFIED_ROUTES.BOUNCE_BACK_BATTLE,
    Component: withSuspenseAndErrorBoundary(BounceBackBattlePage),
  },
  {
    path: UNIFIED_ROUTES.STORY_SYNTH_LAB,
    Component: withSuspenseAndErrorBoundary(StorySynthLabPage),
  },
  {
    path: UNIFIED_ROUTES.FLASH_GLOW,
    Component: withSuspenseAndErrorBoundary(FlashGlowPage),
  },
  {
    path: UNIFIED_ROUTES.AR_FILTERS,
    Component: withSuspenseAndErrorBoundary(ARFiltersPage),
  },
  {
    path: UNIFIED_ROUTES.BUBBLE_BEAT,
    Component: withSuspenseAndErrorBoundary(BubbleBeatPage),
  },
  {
    path: UNIFIED_ROUTES.SCREEN_SILK_BREAK,
    Component: withSuspenseAndErrorBoundary(ScreenSilkBreakPage),
  },
  {
    path: UNIFIED_ROUTES.VR_GALACTIQUE,
    Component: withSuspenseAndErrorBoundary(VRGalactiquePage),
  },
  {
    path: UNIFIED_ROUTES.INSTANT_GLOW,
    Component: withSuspenseAndErrorBoundary(InstantGlowPage),
  },

  // Analytics & data
  {
    path: UNIFIED_ROUTES.WEEKLY_BARS,
    Component: withSuspenseAndErrorBoundary(WeeklyBarsPage),
  },
  {
    path: UNIFIED_ROUTES.HEATMAP_VIBES,
    Component: withSuspenseAndErrorBoundary(HeatmapVibesPage),
  },
  {
    path: UNIFIED_ROUTES.BREATHWORK,
    Component: withSuspenseAndErrorBoundary(BreathworkPage),
  },

  // Paramètres & compte
  {
    path: UNIFIED_ROUTES.PRIVACY_TOGGLES,
    Component: withSuspenseAndErrorBoundary(PrivacyTogglesPage),
  },
  {
    path: UNIFIED_ROUTES.EXPORT_CSV,
    Component: withSuspenseAndErrorBoundary(DataExportPage),
  },
  {
    path: UNIFIED_ROUTES.ACCOUNT_DELETE,
    Component: withSuspenseAndErrorBoundary(AccountDeletionPage),
  },
  {
    path: UNIFIED_ROUTES.HEALTH_CHECK_BADGE,
    Component: withSuspenseAndErrorBoundary(PlatformStatusPage),
  },
  {
    path: UNIFIED_ROUTES.NOTIFICATIONS,
    Component: withSuspenseAndErrorBoundary(NotificationsPage),
  },
  {
    path: UNIFIED_ROUTES.HELP_CENTER,
    Component: withSuspenseAndErrorBoundary(HelpCenterPage),
  },
  {
    path: UNIFIED_ROUTES.PROFILE_SETTINGS,
    Component: withSuspenseAndErrorBoundary(ProfileSettingsPage),
  },

  // Historique & feedback
  {
    path: UNIFIED_ROUTES.ACTIVITY_HISTORY,
    Component: withSuspenseAndErrorBoundary(ActivityHistoryPage),
  },
  {
    path: UNIFIED_ROUTES.FEEDBACK,
    Component: withSuspenseAndErrorBoundary(InAppFeedbackPage),
  },

  // Administration B2B
  {
    path: UNIFIED_ROUTES.SECURITY,
    Component: withSuspenseAndErrorBoundary(SecurityDashboardPage),
  },
  {
    path: UNIFIED_ROUTES.AUDIT,
    Component: withSuspenseAndErrorBoundary(SystemAuditPage),
  },
  {
    path: UNIFIED_ROUTES.ACCESSIBILITY,
    Component: withSuspenseAndErrorBoundary(AccessibilityPage),
  },

  // Pages spéciales
  {
    path: '/audit-ticket-p0',
    Component: withSuspenseAndErrorBoundary(AuditTicketP0Page),
  },
  
  // Testing (development only)
  {
    path: '/test',
    Component: withSuspenseAndErrorBoundary(PlatformTestPage),
  },
  {
    path: '/test/qa',
    Component: withSuspenseAndErrorBoundary(lazy(() => import('@/pages/testing/QATestPage'))),
  },
  {
    path: '/test/report',
    Component: withSuspenseAndErrorBoundary(lazy(() => import('@/pages/testing/QAReportPage'))),
  },

  // Route B2B manquante
  {
    path: UNIFIED_ROUTES.B2B,
    Component: withSuspenseAndErrorBoundary(B2BSelectionPage),
  },

  // Route Onboarding manquante
  {
    path: UNIFIED_ROUTES.ONBOARDING,
    Component: withSuspenseAndErrorBoundary(OnboardingPage),
  },
];
