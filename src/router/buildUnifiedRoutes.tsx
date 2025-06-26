import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';
import { B2CLoginPage, B2CRegisterPage, B2CDashboardPage, B2COnboardingPage, B2CJournalPage, B2CMusicPage, B2CScanPage, B2CCoachPage, B2CVRPage, B2CGamificationPage, B2CSocialPage, B2CSettingsPage } from '@/utils/lazyComponents';
import { B2BUserLoginPage, B2BUserRegisterPage, B2BUserDashboardPage, B2BUserScanPage, B2BUserCoachPage, B2BUserMusicPage } from '@/utils/lazyComponents';
import { B2BAdminLoginPage, B2BAdminDashboardPage } from '@/utils/lazyComponents';
import { ImmersiveHome, MeditationPage, LazyPageWrapper } from '@/utils/unifiedLazyRoutes';
import ChooseModePage from '@/pages/ChooseModePage';
import B2BSelectionPage from '@/pages/b2b/B2BSelectionPage';
import AuthPage from '@/pages/AuthPage';

// Pages manquantes à ajouter
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <AuthPage />,
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />,
    },
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />,
    },
    {
      path: '/b2c/login',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CLoginPage />
        </Suspense>
      ),
    },
    {
      path: '/b2c/register',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CRegisterPage />
        </Suspense>
      ),
    },
    {
      path: '/b2b/user/login',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2BUserLoginPage />
        </Suspense>
      ),
    },
    {
      path: '/b2b/user/register',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2BUserRegisterPage />
        </Suspense>
      ),
    },
    {
      path: '/b2b/admin/login',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2BAdminLoginPage />
        </Suspense>
      ),
    },
    {
      path: '/b2c/dashboard',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />} >
          <B2CDashboardPage />
        </Suspense>
      ),
    },
    {
      path: '/b2b/user/dashboard',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2BUserDashboardPage />
        </Suspense>
      ),
    },
    {
      path: '/b2b/admin/dashboard',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2BAdminDashboardPage />
        </Suspense>
      ),
    },
    {
      path: '/scan',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CScanPage />
        </Suspense>
      ),
    },
    {
      path: '/music',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CMusicPage />
        </Suspense>
      ),
    },
    {
      path: '/coach',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CCoachPage />
        </Suspense>
      ),
    },
    {
      path: '/journal',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CJournalPage />
        </Suspense>
      ),
    },
    {
      path: '/vr',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CVRPage />
        </Suspense>
      ),
    },
    {
      path: '/preferences',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSettingsPage />
        </Suspense>
      ),
    },
    {
      path: '/gamification',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CGamificationPage />
        </Suspense>
      ),
    },
    {
      path: '/social-cocon',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSocialPage />
        </Suspense>
      ),
    },
    {
      path: '/teams',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSettingsPage />
        </Suspense>
      ),
    },
    {
      path: '/reports',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSettingsPage />
        </Suspense>
      ),
    },
    {
      path: '/events',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSettingsPage />
        </Suspense>
      ),
    {
      path: '/optimisation',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSettingsPage />
        </Suspense>
      ),
    },
    {
      path: '/settings',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2CSettingsPage />
        </Suspense>
      ),
    },

    // Nouvelles routes ajoutées
    {
      path: '/boss-level-grit',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <BossLevelGritPage />
        </Suspense>
      ),
    },
    {
      path: '/mood-mixer',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <MoodMixerPage />
        </Suspense>
      ),
    },
    {
      path: '/bounce-back-battle',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <BounceBackBattlePage />
        </Suspense>
      ),
    },
    {
      path: '/instant-glow',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <InstantGlowPage />
        </Suspense>
      ),
    },
    {
      path: '/social-cocon',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <SocialCoconPage />
        </Suspense>
      ),
    },
  ];
}
