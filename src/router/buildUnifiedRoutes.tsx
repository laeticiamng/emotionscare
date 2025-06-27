
import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import FullPageLoader from '@/components/FullPageLoader';

// Lazy loading des pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));

// Pages B2C
const B2CHomePage = lazy(() => import('@/pages/b2c/B2CHomePage'));
const B2CLoginPage = lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));

// Pages B2B
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));

// Pages principales fonctionnalités
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Pages Mesure & Adaptation Immédiate
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

// Wrapper pour le Suspense et ErrorBoundary
const withSuspense = (Component: React.ComponentType) => (
  <ErrorBoundary>
    <Suspense fallback={<FullPageLoader />}>
      <div data-testid="page-root">
        <Component />
      </div>
    </Suspense>
  </ErrorBoundary>
);

export const buildUnifiedRoutes = (): RouteObject[] => {
  console.log('🏗️ Construction des routes unifiées...');

  const routes: RouteObject[] = [
    // Routes principales
    { path: '/', element: withSuspense(HomePage) },
    { path: '/choose-mode', element: withSuspense(ChooseModePage) },
    { path: '/auth', element: withSuspense(AuthPage) },

    // Routes B2C
    { path: '/b2c', element: withSuspense(B2CHomePage) },
    { path: '/b2c/login', element: withSuspense(B2CLoginPage) },
    { path: '/b2c/register', element: withSuspense(B2CRegisterPage) },
    { path: '/b2c/dashboard', element: withSuspense(B2CDashboardPage) },

    // Routes B2B
    { path: '/b2b', element: withSuspense(B2BSelectionPage) },
    { path: '/b2b/selection', element: withSuspense(B2BSelectionPage) },
    { path: '/b2b/user/login', element: withSuspense(B2BUserLoginPage) },
    { path: '/b2b/admin/login', element: withSuspense(B2BAdminLoginPage) },

    // Fonctionnalités principales
    { path: '/scan', element: withSuspense(ScanPage) },
    { path: '/music', element: withSuspense(MusicPage) },
    { path: '/journal', element: withSuspense(JournalPage) },
    { path: '/coach', element: withSuspense(CoachPage) },
    { path: '/vr', element: withSuspense(VRPage) },
    { path: '/notifications', element: withSuspense(NotificationsPage) },

    // Mesure & Adaptation Immédiate (6 nouvelles routes)
    { path: '/flash-glow', element: withSuspense(FlashGlowPage) },
    { path: '/boss-level-grit', element: withSuspense(BossLevelGritPage) },
    { path: '/mood-mixer', element: withSuspense(MoodMixerPage) },
    { path: '/bounce-back-battle', element: withSuspense(BounceBackBattlePage) },
    { path: '/breathwork', element: withSuspense(BreathworkPage) },
    { path: '/instant-glow', element: withSuspense(InstantGlowPage) },

    // Route de fallback pour les 404
    { 
      path: '*', 
      element: (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-red-400">404</h1>
            <p className="text-xl text-slate-300">Page non trouvée</p>
            <a href="/" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Retourner à l'accueil
            </a>
          </div>
        </div>
      )
    }
  ];

  console.log(`✅ ${routes.length} routes construites avec succès`);
  return routes;
};
