
import React, { Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Shell from '@/Shell';
import LoadingAnimation from '@/components/ui/loading-animation';
import { retryLazyImport } from '@/utils/retryLazyImport';

// Pages principales avec retry automatique
const HomePage = React.lazy(() => retryLazyImport(() => import('@/pages/HomePage')));
const ChooseModePage = React.lazy(() => retryLazyImport(() => import('@/pages/ChooseModePage')));
const B2BSelectionPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2BSelectionPage')));
const NotFoundPage = React.lazy(() => retryLazyImport(() => import('@/pages/NotFoundPage')));

// Pages B2C
const B2CLoginPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2CLoginPage')));
const B2CRegisterPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2CRegisterPage')));
const B2CDashboardPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2CDashboardPage')));

// Pages B2B User
const B2BUserLoginPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2BUserLoginPage')));
const B2BUserDashboardPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2BUserDashboardPage')));

// Pages B2B Admin
const B2BAdminLoginPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2BAdminLoginPage')));
const B2BAdminDashboardPage = React.lazy(() => retryLazyImport(() => import('@/pages/B2BAdminDashboardPage')));

// Pages fonctionnelles principales
const ScanPage = React.lazy(() => retryLazyImport(() => import('@/pages/ScanPage')));
const MusicPage = React.lazy(() => retryLazyImport(() => import('@/pages/MusicPage')));
const CoachPage = React.lazy(() => retryLazyImport(() => import('@/pages/CoachPage')));
const JournalPage = React.lazy(() => retryLazyImport(() => import('@/pages/JournalPage')));
const VRPage = React.lazy(() => retryLazyImport(() => import('@/pages/VRPage')));
const PreferencesPage = React.lazy(() => retryLazyImport(() => import('@/pages/PreferencesPage')));
const GamificationPage = React.lazy(() => retryLazyImport(() => import('@/pages/GamificationPage')));
const SocialCocoonPage = React.lazy(() => retryLazyImport(() => import('@/pages/SocialCocoonPage')));

// Pages premium
const BossLevelGritPage = React.lazy(() => retryLazyImport(() => import('@/pages/BossLevelGritPage')));
const MoodMixerPage = React.lazy(() => retryLazyImport(() => import('@/pages/MoodMixerPage')));
const AmbitionArcadePage = React.lazy(() => retryLazyImport(() => import('@/pages/AmbitionArcadePage')));
const BounceBackBattlePage = React.lazy(() => retryLazyImport(() => import('@/pages/BounceBackBattlePage')));
const StorySynthLabPage = React.lazy(() => retryLazyImport(() => import('@/pages/StorySynthLabPage')));
const FlashGlowPage = React.lazy(() => retryLazyImport(() => import('@/pages/FlashGlowPage')));
const InstantGlowPage = React.lazy(() => retryLazyImport(() => import('@/pages/InstantGlowPage')));
const ARFiltersPage = React.lazy(() => retryLazyImport(() => import('@/pages/ARFiltersPage')));
const BubbleBeatPage = React.lazy(() => retryLazyImport(() => import('@/pages/BubbleBeatPage')));
const ScreenSilkBreakPage = React.lazy(() => retryLazyImport(() => import('@/pages/ScreenSilkBreakPage')));
const VRGalactiquePage = React.lazy(() => retryLazyImport(() => import('@/pages/VRGalactiquePage')));
const WeeklyBarsPage = React.lazy(() => retryLazyImport(() => import('@/pages/WeeklyBarsPage')));
const HeatmapVibesPage = React.lazy(() => retryLazyImport(() => import('@/pages/HeatmapVibesPage')));
const BreathworkPage = React.lazy(() => retryLazyImport(() => import('@/pages/BreathworkPage')));
const PrivacyTogglesPage = React.lazy(() => retryLazyImport(() => import('@/pages/PrivacyTogglesPage')));
const ExportCSVPage = React.lazy(() => retryLazyImport(() => import('@/pages/ExportCSVPage')));
const HealthCheckBadgePage = React.lazy(() => retryLazyImport(() => import('@/pages/HealthCheckBadgePage')));
const OnboardingFlowPage = React.lazy(() => retryLazyImport(() => import('@/pages/OnboardingFlowPage')));
const NotificationsPage = React.lazy(() => retryLazyImport(() => import('@/pages/NotificationsPage')));
const HelpCenterPage = React.lazy(() => retryLazyImport(() => import('@/pages/HelpCenterPage')));
const ProfileSettingsPage = React.lazy(() => retryLazyImport(() => import('@/pages/ProfileSettingsPage')));
const ActivityHistoryPage = React.lazy(() => retryLazyImport(() => import('@/pages/ActivityHistoryPage')));
const FeedbackPage = React.lazy(() => retryLazyImport(() => import('@/pages/FeedbackPage')));

// Wrapper unifié pour toutes les pages avec Suspense
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="flex h-screen items-center justify-center">
      <LoadingAnimation text="Chargement de la page..." />
    </div>
  }>
    {children}
  </Suspense>
);

// Configuration des routes unifiée
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <PageWrapper><HomePage /></PageWrapper>,
      },
      {
        path: 'choose-mode',
        element: <PageWrapper><ChooseModePage /></PageWrapper>,
      },
      {
        path: 'b2b/selection',
        element: <PageWrapper><B2BSelectionPage /></PageWrapper>,
      },
      {
        path: 'b2b',
        element: <PageWrapper><B2BSelectionPage /></PageWrapper>, // Redirection vers sélection
      },
      
      // Routes B2C
      {
        path: 'b2c/login',
        element: <PageWrapper><B2CLoginPage /></PageWrapper>,
      },
      {
        path: 'b2c/register',
        element: <PageWrapper><B2CRegisterPage /></PageWrapper>,
      },
      {
        path: 'b2c/dashboard',
        element: <PageWrapper><B2CDashboardPage /></PageWrapper>,
      },
      
      // Routes B2B User
      {
        path: 'b2b/user/login',
        element: <PageWrapper><B2BUserLoginPage /></PageWrapper>,
      },
      {
        path: 'b2b/user/dashboard',
        element: <PageWrapper><B2BUserDashboardPage /></PageWrapper>,
      },
      
      // Routes B2B Admin
      {
        path: 'b2b/admin/login',
        element: <PageWrapper><B2BAdminLoginPage /></PageWrapper>,
      },
      {
        path: 'b2b/admin/dashboard',
        element: <PageWrapper><B2BAdminDashboardPage /></PageWrapper>,
      },
      
      // Fonctionnalités principales
      {
        path: 'scan',
        element: <PageWrapper><ScanPage /></PageWrapper>,
      },
      {
        path: 'music',
        element: <PageWrapper><MusicPage /></PageWrapper>,
      },
      {
        path: 'coach',
        element: <PageWrapper><CoachPage /></PageWrapper>,
      },
      {
        path: 'journal',
        element: <PageWrapper><JournalPage /></PageWrapper>,
      },
      {
        path: 'vr',
        element: <PageWrapper><VRPage /></PageWrapper>,
      },
      {
        path: 'preferences',
        element: <PageWrapper><PreferencesPage /></PageWrapper>,
      },
      {
        path: 'gamification',
        element: <PageWrapper><GamificationPage /></PageWrapper>,
      },
      {
        path: 'social-cocon',
        element: <PageWrapper><SocialCocoonPage /></PageWrapper>,
      },
      
      // Pages premium
      {
        path: 'boss-level-grit',
        element: <PageWrapper><BossLevelGritPage /></PageWrapper>,
      },
      {
        path: 'mood-mixer',
        element: <PageWrapper><MoodMixerPage /></PageWrapper>,
      },
      {
        path: 'ambition-arcade',
        element: <PageWrapper><AmbitionArcadePage /></PageWrapper>,
      },
      {
        path: 'bounce-back-battle',
        element: <PageWrapper><BounceBackBattlePage /></PageWrapper>,
      },
      {
        path: 'story-synth-lab',
        element: <PageWrapper><StorySynthLabPage /></PageWrapper>,
      },
      {
        path: 'flash-glow',
        element: <PageWrapper><FlashGlowPage /></PageWrapper>,
      },
      {
        path: 'instant-glow',
        element: <PageWrapper><InstantGlowPage /></PageWrapper>,
      },
      {
        path: 'ar-filters',
        element: <PageWrapper><ARFiltersPage /></PageWrapper>,
      },
      {
        path: 'bubble-beat',
        element: <PageWrapper><BubbleBeatPage /></PageWrapper>,
      },
      {
        path: 'screen-silk-break',
        element: <PageWrapper><ScreenSilkBreakPage /></PageWrapper>,
      },
      {
        path: 'vr-galactique',
        element: <PageWrapper><VRGalactiquePage /></PageWrapper>,
      },
      {
        path: 'weekly-bars',
        element: <PageWrapper><WeeklyBarsPage /></PageWrapper>,
      },
      {
        path: 'heatmap-vibes',
        element: <PageWrapper><HeatmapVibesPage /></PageWrapper>,
      },
      {
        path: 'breathwork',
        element: <PageWrapper><BreathworkPage /></PageWrapper>,
      },
      {
        path: 'privacy-toggles',
        element: <PageWrapper><PrivacyTogglesPage /></PageWrapper>,
      },
      {
        path: 'export-csv',
        element: <PageWrapper><ExportCSVPage /></PageWrapper>,
      },
      {
        path: 'health-check-badge',
        element: <PageWrapper><HealthCheckBadgePage /></PageWrapper>,
      },
      {
        path: 'onboarding-flow',
        element: <PageWrapper><OnboardingFlowPage /></PageWrapper>,
      },
      {
        path: 'notifications',
        element: <PageWrapper><NotificationsPage /></PageWrapper>,
      },
      {
        path: 'help-center',
        element: <PageWrapper><HelpCenterPage /></PageWrapper>,
      },
      {
        path: 'profile-settings',
        element: <PageWrapper><ProfileSettingsPage /></PageWrapper>,
      },
      {
        path: 'activity-history',
        element: <PageWrapper><ActivityHistoryPage /></PageWrapper>,
      },
      {
        path: 'feedback',
        element: <PageWrapper><FeedbackPage /></PageWrapper>,
      },
      
      // Page 404
      {
        path: '*',
        element: <PageWrapper><NotFoundPage /></PageWrapper>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
export default router;
