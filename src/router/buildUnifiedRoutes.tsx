
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import { homeRoutes } from './routes/homeRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { innovationRoutes } from './routes/innovationRoutes';
import { rhRoutes } from './routes/rhRoutes';

// Page components avec lazy loading
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/B2BSelectionPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const TestPage = React.lazy(() => import('@/pages/TestPage'));
const Point20Page = React.lazy(() => import('@/pages/Point20Page'));

// Nouvelles pages pour les 52 routes
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const VrPage = React.lazy(() => import('@/pages/VrPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const FlashGlowPage = React.lazy(() => import('@/pages/FlashGlowPage'));
const MoodMixerPage = React.lazy(() => import('@/pages/MoodMixerPage'));
const BreathworkPage = React.lazy(() => import('@/pages/BreathworkPage'));
const SocialCoconPage = React.lazy(() => import('@/pages/SocialCoconPage'));

// Wrapper pour Suspense
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <LoadingAnimation size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

// Manifeste des routes pour les tests E2E
export const ROUTE_MANIFEST = [
  '/',
  '/choose-mode', 
  '/auth',
  '/b2b',
  '/test',
  '/point20',
  '/scan',
  '/music',
  '/journal',
  '/coach',
  '/vr',
  '/gamification',
  '/flash-glow',
  '/mood-mixer',
  '/breathwork',
  '/social-cocon'
];

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'choose-mode',
          element: (
            <SuspenseWrapper>
              <ChooseModePage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'auth',
          element: (
            <SuspenseWrapper>
              <AuthPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'b2b',
          element: (
            <SuspenseWrapper>
              <B2BSelectionPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'test',
          element: (
            <SuspenseWrapper>
              <TestPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'point20',
          element: (
            <SuspenseWrapper>
              <Point20Page />
            </SuspenseWrapper>
          ),
        },
        // Nouvelles routes principales
        {
          path: 'scan',
          element: (
            <SuspenseWrapper>
              <ScanPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'music',
          element: (
            <SuspenseWrapper>
              <MusicPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'journal',
          element: (
            <SuspenseWrapper>
              <JournalPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'coach',
          element: (
            <SuspenseWrapper>
              <CoachPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'vr',
          element: (
            <SuspenseWrapper>
              <VrPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'gamification',
          element: (
            <SuspenseWrapper>
              <GamificationPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'flash-glow',
          element: (
            <SuspenseWrapper>
              <FlashGlowPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'mood-mixer',
          element: (
            <SuspenseWrapper>
              <MoodMixerPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'breathwork',
          element: (
            <SuspenseWrapper>
              <BreathworkPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'social-cocon',
          element: (
            <SuspenseWrapper>
              <SocialCoconPage />
            </SuspenseWrapper>
          ),
        },
        // Intégration des routes des modules existants
        ...innovationRoutes,
        ...rhRoutes,
      ],
    },
    // Route 404 - doit être la dernière
    {
      path: '*',
      element: (
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      ),
    },
  ];
};
