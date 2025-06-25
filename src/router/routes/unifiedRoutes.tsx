import { ErrorBoundary } from '@/components/ui/error-boundary';
import { RouteObject } from 'react-router-dom';
import B2BAdminDashboardPage from '@/pages/b2b/admin/dashboard/B2BAdminDashboardPage';
import B2BAdminLoginPage from '@/pages/b2b/admin/login/B2BAdminLoginPage';
import B2BPage from '@/pages/b2b/B2BPage';
import B2BSelectionPage from '@/pages/b2b/B2BSelectionPage';
import B2BUserDashboardPage from '@/pages/b2b/user/dashboard/B2BUserDashboardPage';
import B2BUserLoginPage from '@/pages/b2b/user/login/B2BUserLoginPage';
import B2CRegisterPage from '@/pages/b2c/register/B2CRegisterPage';
import B2CLoginPage from '@/pages/b2c/login/B2CLoginPage';
import B2CDashboardPage from '@/pages/b2c/dashboard/B2CDashboardPage';
import ChooseModePage from '@/pages/ChooseModePage';
import HomePage from '@/pages/HomePage';
import ScanPage from '@/pages/ScanPage';
import MusicTherapyPage from '@/pages/MusicTherapyPage';
import FlashGlowPage from '@/pages/FlashGlowPage';
import BossLevelGritPage from '@/pages/BossLevelGritPage';
import MoodMixerPage from '@/pages/MoodMixerPage';
import BounceBackBattlePage from '@/pages/BounceBackBattlePage';
import BreathworkPage from '@/pages/BreathworkPage';
import InstantGlowPage from '@/pages/InstantGlowPage';
import VRSessionViewPage from '@/pages/VRSessionViewPage';
import VRGalactiquePage from '@/pages/VRGalactiquePage';
import ScreenSilkBreakPage from '@/pages/ScreenSilkBreakPage';
import StorySynthLabPage from '@/pages/StorySynthLabPage';
import ARFiltersPage from '@/pages/ARFiltersPage';
import BubbleBeatPage from '@/pages/BubbleBeatPage';
import AmbitionArcadePage from '@/pages/AmbitionArcadePage';
import GamificationPage from '@/pages/GamificationPage';
import WeeklyBarsPage from '@/pages/WeeklyBarsPage';
import HeatmapVibesPage from '@/pages/HeatmapVibesPage';
import OnboardingPage from '@/pages/OnboardingPage';
import PreferencesPage from '@/pages/PreferencesPage';
import SocialCoconPage from '@/pages/SocialCoconPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ActivityHistoryPage from '@/pages/ActivityHistoryPage';
import NotificationsPage from '@/pages/NotificationsPage';
import FeedbackPage from '@/pages/FeedbackPage';
import AccountDeletePage from '@/pages/AccountDeletePage';
import ExportCsvPage from '@/pages/ExportCsvPage';
import PrivacyTogglesPage from '@/pages/PrivacyTogglesPage';
import HealthCheckBadgePage from '@/pages/HealthCheckBadgePage';
import TeamsPage from '@/pages/TeamsPage';
import ReportsPage from '@/pages/ReportsPage';
import EventsPage from '@/pages/EventsPage';
import OptimisationPage from '@/pages/OptimisationPage';
import SettingsPage from '@/pages/SettingsPage';
import SecurityPage from '@/pages/SecurityPage';
import AuditPage from '@/pages/AuditPage';
import AccessibilityPage from '@/pages/AccessibilityPage';
import InnovationPage from '@/pages/InnovationPage';
import HelpCenterPage from '@/pages/HelpCenterPage';
import B2BUserRegisterPage from '@/pages/b2b/user/register/B2BUserRegisterPage';
import B2BAdminRegisterPage from '@/pages/b2b/admin/register/B2BAdminRegisterPage';
import JournalPage from '@/pages/JournalPage';
import CoachChatPage from '@/pages/CoachChatPage';
import AuditTicketP0Page from '@/pages/AuditTicketP0Page';

export const unifiedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2c',
    element: <B2CLoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2c/login',
    element: <B2CLoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2c/register',
    element: <B2CRegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2c/dashboard',
    element: <B2CDashboardPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b',
    element: <B2BPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/user/login',
    element: <B2BUserLoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/user/register',
    element: <B2BUserRegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/user/dashboard',
    element: <B2BUserDashboardPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/admin/register',
    element: <B2BAdminRegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: <B2BAdminDashboardPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/scan',
    element: <ScanPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/music',
    element: <MusicTherapyPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/flash-glow',
    element: <FlashGlowPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/boss-level-grit',
    element: <BossLevelGritPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/mood-mixer',
    element: <MoodMixerPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/bounce-back-battle',
    element: <BounceBackBattlePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/breathwork',
    element: <BreathworkPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/instant-glow',
    element: <InstantGlowPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/vr',
    element: <VRSessionViewPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/vr-galactique',
    element: <VRGalactiquePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/screen-silk-break',
    element: <ScreenSilkBreakPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/story-synth-lab',
    element: <StorySynthLabPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/ar-filters',
    element: <ARFiltersPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/bubble-beat',
    element: <BubbleBeatPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/ambition-arcade',
    element: <AmbitionArcadePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/gamification',
    element: <GamificationPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/weekly-bars',
    element: <WeeklyBarsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/heatmap-vibes',
    element: <HeatmapVibesPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/preferences',
    element: <PreferencesPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/social-cocon',
    element: <SocialCoconPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/profile-settings',
    element: <ProfileSettingsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/activity-history',
    element: <ActivityHistoryPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/feedback',
    element: <FeedbackPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/account-delete',
    element: <AccountDeletePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/export-csv',
    element: <ExportCsvPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/privacy-toggles',
    element: <PrivacyTogglesPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/health-check-badge',
    element: <HealthCheckBadgePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/teams',
    element: <TeamsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/reports',
    element: <ReportsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/events',
    element: <EventsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/optimisation',
    element: <OptimisationPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/security',
    element: <SecurityPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/audit',
    element: <AuditPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/accessibility',
    element: <AccessibilityPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/innovation',
    element: <InnovationPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/help-center',
    element: <HelpCenterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/journal',
    element: <JournalPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/coach',
    element: <CoachChatPage />,
    errorElement: <ErrorBoundary />,
  },
    {
      path: '/audit-ticket-p0',
      element: <AuditTicketP0Page />
    },
];
