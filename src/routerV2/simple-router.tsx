/**
 * Simple Router - Version simplifiée pour debug
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';
import { SecurityProvider } from '@/components/security/SecurityProvider';

// Pages simples 
const HomePage = lazy(() => import('@/components/HomePage'));
const UnifiedLoginPage = lazy(() => import('@/pages/unified/UnifiedLoginPage'));
const B2CHomePage = lazy(() => import('@/pages/B2CHomePage'));

// Pages modules B2C
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CMusicTherapyPremiumPage = lazy(() => import('@/pages/B2CMusicTherapyPremiumPage'));
const B2CJournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const B2CAICoachPage = lazy(() => import('@/pages/B2CAICoachPage'));
const B2CFlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const B2CBreathworkPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const B2CVRBreathGuidePage = lazy(() => import('@/pages/B2CVRBreathGuidePage'));
const B2CVRGalaxyPage = lazy(() => import('@/pages/B2CVRGalaxyPage'));
const B2CMoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const B2CBossLevelGritPage = lazy(() => import('@/pages/B2CBossLevelGritPage'));
const B2CAmbitionArcadePage = lazy(() => import('@/pages/B2CAmbitionArcadePage'));
const B2CBounceBackBattlePage = lazy(() => import('@/pages/B2CBounceBackBattlePage'));
const B2CScreenSilkBreakPage = lazy(() => import('@/pages/B2CScreenSilkBreakPage'));
const B2CARFiltersPage = lazy(() => import('@/pages/B2CARFiltersPage'));
const B2CStorySynthLabPage = lazy(() => import('@/pages/B2CStorySynthLabPage'));
const B2CBubbleBeatPage = lazy(() => import('@/pages/B2CBubbleBeatPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const B2CActivitePage = lazy(() => import('@/pages/B2CActivitePage'));
const PrivacyPage = lazy(() => import('@/app/legal/privacy/page'));
const TermsPage = lazy(() => import('@/app/legal/terms/page'));
const AccountDataPage = lazy(() => import('@/app/account/data/page'));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Chargement..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

// Wrapper avec SecurityProvider pour les routes qui en ont besoin
const SecureWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SecurityProvider>
    <SuspenseWrapper>
      {children}
    </SuspenseWrapper>
  </SecurityProvider>
);

export const simpleRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <UnifiedLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/app/home',
    element: (
      <SecureWrapper>
        <B2CHomePage />
      </SecureWrapper>
    ),
  },
  // Routes des modules B2C
  {
    path: '/app/scan',
    element: (
      <SecureWrapper>
        <B2CScanPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/music',
    element: (
      <SecureWrapper>
        <B2CMusicTherapyPremiumPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/journal',
    element: (
      <SecureWrapper>
        <B2CJournalPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/coach',
    element: (
      <SecureWrapper>
        <B2CAICoachPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/flash-glow',
    element: (
      <SecureWrapper>
        <B2CFlashGlowPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/breath',
    element: (
      <SecureWrapper>
        <B2CBreathworkPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/vr-breath',
    element: (
      <SecureWrapper>
        <B2CVRBreathGuidePage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/vr-galaxy',
    element: (
      <SecureWrapper>
        <B2CVRGalaxyPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/mood-mixer',
    element: (
      <SecureWrapper>
        <B2CMoodMixerPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/boss-grit',
    element: (
      <SecureWrapper>
        <B2CBossLevelGritPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/ambition-arcade',
    element: (
      <SecureWrapper>
        <B2CAmbitionArcadePage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/bounce-back',
    element: (
      <SecureWrapper>
        <B2CBounceBackBattlePage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/screen-silk',
    element: (
      <SecureWrapper>
        <B2CScreenSilkBreakPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/face-ar',
    element: (
      <SecureWrapper>
        <B2CARFiltersPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/story-synth',
    element: (
      <SecureWrapper>
        <B2CStorySynthLabPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/bubble-beat',
    element: (
      <SecureWrapper>
        <B2CBubbleBeatPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/leaderboard',
    element: (
      <SecureWrapper>
        <LeaderboardPage />
      </SecureWrapper>
    ),
  },
  {
    path: '/app/activity',
    element: (
      <SecureWrapper>
        <B2CActivitePage />
      </SecureWrapper>
    ),
  },
  {
    path: '/legal/privacy',
    element: (
      <SuspenseWrapper>
        <PrivacyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/legal/terms',
    element: (
      <SuspenseWrapper>
        <TermsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/account/data',
    element: (
      <SecureWrapper>
        <AccountDataPage />
      </SecureWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);