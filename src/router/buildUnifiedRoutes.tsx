
import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import LoadingAnimation from '@/components/ui/loading-animation';

// Pages existantes (import direct)
import HomePage from '@/pages/HomePage';
import ChooseModePage from '@/pages/ChooseModePage';
import AuthPage from '@/pages/AuthPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import NotFoundPage from '@/pages/NotFoundPage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';

// Pages avec lazy loading (fichiers existants)
const VRPage = lazy(() => import('@/pages/VRPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));

// Pages temporaires simples pour les routes manquantes
const TemporaryPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
      <div className="animate-pulse bg-gradient-to-r from-purple-200 to-blue-200 h-32 rounded-lg"></div>
    </div>
  </div>
);

// Wrapper pour Suspense
const withSuspense = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<LoadingAnimation text="Chargement..." />}>
    <Component {...props} />
  </Suspense>
);

// Création des pages temporaires
const ScanPage = () => <TemporaryPage title="Scanner Émotionnel" />;
const MusicPage = () => <TemporaryPage title="Thérapie Musicale" />;
const JournalPage = () => <TemporaryPage title="Journal Émotionnel" />;
const CoachPage = () => <TemporaryPage title="Coach IA" />;
const SocialCoconPage = () => <TemporaryPage title="Social Cocon" />;
const FlashGlowPage = () => <TemporaryPage title="Flash Glow" />;
const MoodMixerPage = () => <TemporaryPage title="Mood Mixer" />;
const BreathworkPage = () => <TemporaryPage title="Exercices de Respiration" />;
const PreferencesPage = () => <TemporaryPage title="Préférences" />;
const SettingsPage = () => <TemporaryPage title="Paramètres" />;

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    // Routes publiques
    {
      path: UNIFIED_ROUTES.HOME,
      element: <HomePage />,
    },
    {
      path: UNIFIED_ROUTES.CHOOSE_MODE,
      element: <ChooseModePage />,
    },
    {
      path: UNIFIED_ROUTES.AUTH,
      element: <AuthPage />,
    },
    {
      path: UNIFIED_ROUTES.B2B_SELECTION,
      element: <B2BSelectionPage />,
    },

    // Routes fonctionnelles avec lazy loading
    {
      path: UNIFIED_ROUTES.VR,
      element: withSuspense(VRPage)({}),
    },
    {
      path: '/meditation',
      element: withSuspense(MeditationPage)({}),
    },
    {
      path: UNIFIED_ROUTES.GAMIFICATION,
      element: withSuspense(GamificationPage)({}),
    },

    // Routes temporaires (pages en développement)
    {
      path: UNIFIED_ROUTES.SCAN,
      element: <ScanPage />,
    },
    {
      path: UNIFIED_ROUTES.MUSIC,
      element: <MusicPage />,
    },
    {
      path: UNIFIED_ROUTES.JOURNAL,
      element: <JournalPage />,
    },
    {
      path: UNIFIED_ROUTES.COACH,
      element: <CoachPage />,
    },
    {
      path: UNIFIED_ROUTES.SOCIAL_COCON,
      element: <SocialCoconPage />,
    },
    {
      path: '/flash-glow',
      element: <FlashGlowPage />,
    },
    {
      path: '/mood-mixer',
      element: <MoodMixerPage />,
    },
    {
      path: '/breathwork',
      element: <BreathworkPage />,
    },
    {
      path: UNIFIED_ROUTES.PREFERENCES,
      element: <PreferencesPage />,
    },
    {
      path: UNIFIED_ROUTES.SETTINGS,
      element: <SettingsPage />,
    },

    // Routes de test
    {
      path: '/test',
      element: <TestPage />,
    },
    {
      path: '/point20',
      element: <Point20Page />,
    },

    // Route 404
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];
}
