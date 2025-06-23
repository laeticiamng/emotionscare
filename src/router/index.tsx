
import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Shell from '@/Shell';
import LoadingAnimation from '@/components/ui/loading-animation';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

// Lazy loading with error boundaries
const LazyPage = ({ Component }: { Component: React.ComponentType }) => (
  <EnhancedErrorBoundary>
    <Suspense fallback={<LoadingAnimation text="Chargement..." />}>
      <div data-testid="page-root">
        <Component />
      </div>
    </Suspense>
  </EnhancedErrorBoundary>
);

// Pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

// Pages B2C
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));

// Pages B2B User
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));

// Pages B2B Admin
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));

// Pages fonctionnelles
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCocoonPage = lazy(() => import('@/pages/SocialCocoonPage'));

// Pages premium/spécialisées
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const PrivacyTogglesPa = lazy(() => import('@/pages/PrivacyTogglesPage'));
const ExportCSVPage = lazy(() => import('@/pages/ExportCSVPage'));
const HealthCheckBadgePage = lazy(() => import('@/pages/HealthCheckBadgePage'));
const OnboardingFlowPage = lazy(() => import('@/pages/OnboardingFlowPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    errorElement: (
      <EnhancedErrorBoundary>
        <div data-testid="page-root">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Erreur de routage</h1>
              <p className="text-muted-foreground">Une erreur inattendue s'est produite.</p>
            </div>
          </div>
        </div>
      </EnhancedErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <LazyPage Component={HomePage} />,
      },
      {
        path: 'choose-mode',
        element: <LazyPage Component={ChooseModePage} />,
      },
      
      // Routes B2B
      {
        path: 'b2b',
        children: [
          {
            index: true,
            element: <LazyPage Component={B2BSelectionPage} />,
          },
          {
            path: 'selection',
            element: <LazyPage Component={B2BSelectionPage} />,
          },
          {
            path: 'user',
            children: [
              {
                path: 'login',
                element: <LazyPage Component={B2BUserLoginPage} />,
              },
              {
                path: 'dashboard',
                element: <LazyPage Component={B2BUserDashboardPage} />,
              },
            ],
          },
          {
            path: 'admin',
            children: [
              {
                path: 'login',
                element: <LazyPage Component={B2BAdminLoginPage} />,
              },
              {
                path: 'dashboard',
                element: <LazyPage Component={B2BAdminDashboardPage} />,
              },
            ],
          },
        ],
      },
      
      // Routes B2C
      {
        path: 'b2c',
        children: [
          {
            path: 'login',
            element: <LazyPage Component={B2CLoginPage} />,
          },
          {
            path: 'register',
            element: <LazyPage Component={B2CRegisterPage} />,
          },
          {
            path: 'dashboard',
            element: <LazyPage Component={B2CDashboardPage} />,
          },
        ],
      },
      
      // Routes fonctionnelles principales
      {
        path: 'scan',
        element: <LazyPage Component={ScanPage} />,
      },
      {
        path: 'music',
        element: <LazyPage Component={MusicPage} />,
      },
      {
        path: 'coach',
        element: <LazyPage Component={CoachPage} />,
      },
      {
        path: 'journal',
        element: <LazyPage Component={JournalPage} />,
      },
      {
        path: 'vr',
        element: <LazyPage Component={VRPage} />,
      },
      {
        path: 'preferences',
        element: <LazyPage Component={PreferencesPage} />,
      },
      {
        path: 'gamification',
        element: <LazyPage Component={GamificationPage} />,
      },
      {
        path: 'social-cocon',
        element: <LazyPage Component={SocialCocoonPage} />,
      },
      
      // Routes premium/spécialisées
      {
        path: 'boss-level-grit',
        element: <LazyPage Component={BossLevelGritPage} />,
      },
      {
        path: 'mood-mixer',
        element: <LazyPage Component={MoodMixerPage} />,
      },
      {
        path: 'ambition-arcade',
        element: <LazyPage Component={AmbitionArcadePage} />,
      },
      {
        path: 'bounce-back-battle',
        element: <LazyPage Component={BounceBackBattlePage} />,
      },
      {
        path: 'story-synth-lab',
        element: <LazyPage Component={StorySynthLabPage} />,
      },
      {
        path: 'flash-glow',
        element: <LazyPage Component={FlashGlowPage} />,
      },
      {
        path: 'instant-glow',
        element: <LazyPage Component={InstantGlowPage} />,
      },
      {
        path: 'ar-filters',
        element: <LazyPage Component={ARFiltersPage} />,
      },
      {
        path: 'bubble-beat',
        element: <LazyPage Component={BubbleBeatPage} />,
      },
      {
        path: 'screen-silk-break',
        element: <LazyPage Component={ScreenSilkBreakPage} />,
      },
      {
        path: 'vr-galactique',
        element: <LazyPage Component={VRGalactiquePage} />,
      },
      {
        path: 'weekly-bars',
        element: <LazyPage Component={WeeklyBarsPage} />,
      },
      {
        path: 'heatmap-vibes',
        element: <LazyPage Component={HeatmapVibesPage} />,
      },
      {
        path: 'breathwork',
        element: <LazyPage Component={BreathworkPage} />,
      },
      {
        path: 'privacy-toggles',
        element: <LazyPage Component={PrivacyTogglesPa} />,
      },
      {
        path: 'export-csv',
        element: <LazyPage Component={ExportCSVPage} />,
      },
      {
        path: 'health-check-badge',
        element: <LazyPage Component={HealthCheckBadgePage} />,
      },
      {
        path: 'onboarding-flow',
        element: <LazyPage Component={OnboardingFlowPage} />,
      },
      {
        path: 'notifications',
        element: <LazyPage Component={NotificationsPage} />,
      },
      {
        path: 'help-center',
        element: <LazyPage Component={HelpCenterPage} />,
      },
      {
        path: 'profile-settings',
        element: <LazyPage Component={ProfileSettingsPage} />,
      },
      {
        path: 'activity-history',
        element: <LazyPage Component={ActivityHistoryPage} />,
      },
      {
        path: 'feedback',
        element: <LazyPage Component={FeedbackPage} />,
      },
      
      // Page 404 - doit être en dernier
      {
        path: '*',
        element: <LazyPage Component={NotFoundPage} />,
      },
    ],
  },
]);
