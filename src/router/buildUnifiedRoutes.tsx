
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import LoadingAnimation from '@/components/ui/loading-animation';

// Lazy loading des pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

// Pages B2C
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));

// Pages B2B User
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/B2BUserDashboardPage'));

// Pages B2B Admin
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/B2BAdminDashboardPage'));

// Pages de fonctionnalités
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCocoonPage = lazy(() => import('@/pages/SocialCocoonPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));

// Nouvelles pages créées
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

// Nouvelles pages immersives
const VRGalactiquePage = lazy(() => import('@/pages/VRGalactiquePage'));
const ScreenSilkBreakPage = lazy(() => import('@/pages/ScreenSilkBreakPage'));
const StorySynthLabPage = lazy(() => import('@/pages/StorySynthLabPage'));
const ARFiltersPage = lazy(() => import('@/pages/ARFiltersPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));

// Wrapper pour le Suspense
const withSuspense = (Component: React.ComponentType) => () => (
  <Suspense fallback={<LoadingAnimation text="Chargement de la page..." />}>
    <Component />
  </Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: withSuspense(HomePage)(),
        },
        {
          path: 'choose-mode',
          element: withSuspense(ChooseModePage)(),
        },
        {
          path: 'onboarding',
          element: withSuspense(OnboardingPage)(),
        },

        // Routes B2C
        {
          path: 'b2c/login',
          element: withSuspense(B2CLoginPage)(),
        },
        {
          path: 'b2c/register',
          element: withSuspense(B2CRegisterPage)(),
        },
        {
          path: 'b2c/dashboard',
          element: withSuspense(B2CDashboardPage)(),
        },

        // Routes B2B User
        {
          path: 'b2b/user/login',
          element: withSuspense(B2BUserLoginPage)(),
        },
        {
          path: 'b2b/user/register',
          element: withSuspense(B2BUserRegisterPage)(),
        },
        {
          path: 'b2b/user/dashboard',
          element: withSuspense(B2BUserDashboardPage)(),
        },

        // Routes B2B Admin
        {
          path: 'b2b/admin/login',
          element: withSuspense(B2BAdminLoginPage)(),
        },
        {
          path: 'b2b/admin/dashboard',
          element: withSuspense(B2BAdminDashboardPage)(),
        },

        // Routes de fonctionnalités principales
        {
          path: 'scan',
          element: withSuspense(ScanPage)(),
        },
        {
          path: 'music',
          element: withSuspense(MusicPage)(),
        },
        {
          path: 'coach',
          element: withSuspense(CoachPage)(),
        },
        {
          path: 'journal',
          element: withSuspense(JournalPage)(),
        },
        {
          path: 'vr',
          element: withSuspense(VRPage)(),
        },
        {
          path: 'preferences',
          element: withSuspense(PreferencesPage)(),
        },
        {
          path: 'gamification',
          element: withSuspense(GamificationPage)(),
        },
        {
          path: 'social-cocon',
          element: withSuspense(SocialCocoonPage)(),
        },
        {
          path: 'notifications',
          element: withSuspense(NotificationsPage)(),
        },
        {
          path: 'help-center',
          element: withSuspense(HelpCenterPage)(),
        },

        // Routes mesure & adaptation immédiate
        {
          path: 'flash-glow',
          element: withSuspense(FlashGlowPage)(),
        },
        {
          path: 'boss-level-grit',
          element: withSuspense(BossLevelGritPage)(),
        },
        {
          path: 'mood-mixer',
          element: withSuspense(MoodMixerPage)(),
        },
        {
          path: 'bounce-back-battle',
          element: withSuspense(BounceBackBattlePage)(),
        },
        {
          path: 'breathwork',
          element: withSuspense(BreathworkPage)(),
        },
        {
          path: 'instant-glow',
          element: withSuspense(InstantGlowPage)(),
        },

        // Routes expériences immersives
        {
          path: 'vr-galactique',
          element: withSuspense(VRGalactiquePage)(),
        },
        {
          path: 'screen-silk-break',
          element: withSuspense(ScreenSilkBreakPage)(),
        },
        {
          path: 'story-synth-lab',
          element: withSuspense(StorySynthLabPage)(),
        },
        {
          path: 'ar-filters',
          element: withSuspense(ARFiltersPage)(),
        },
        {
          path: 'bubble-beat',
          element: withSuspense(BubbleBeatPage)(),
        },

        // Redirections
        {
          path: 'b2b',
          element: <Navigate to="/b2b/admin/dashboard" replace />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];
};
