
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

// Lazy imports pour toutes les pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const BreathworkPage = React.lazy(() => import('@/pages/BreathworkPage'));
const OnboardingPage = React.lazy(() => import('@/pages/OnboardingPage'));
const FlashGlowPage = React.lazy(() => import('@/pages/FlashGlowPage'));
const ProfileSettingsPage = React.lazy(() => import('@/pages/ProfileSettingsPage'));
const BossLevelGritPage = React.lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = React.lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = React.lazy(() => import('@/pages/BounceBackBattlePage'));
const InstantGlowPage = React.lazy(() => import('@/pages/InstantGlowPage'));
const SocialCoconPage = React.lazy(() => import('@/pages/SocialCoconPage'));

// Auth Pages
const B2CLoginPage = React.lazy(() => import('@/pages/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/auth/B2CRegisterPage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/auth/B2BSelectionPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/auth/B2BAdminLoginPage'));

// Dashboard Pages
const B2CDashboardPage = React.lazy(() => import('@/pages/dashboard/B2CDashboardPage'));
const B2BUserDashboardPage = React.lazy(() => import('@/pages/dashboard/B2BUserDashboardPage'));
const B2BAdminDashboardPage = React.lazy(() => import('@/pages/dashboard/B2BAdminDashboardPage'));

// Feature Pages
const PreferencesPage = React.lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));

export function buildUnifiedRoutes(): RouteObject[] {
  return [
    // Routes publiques
    {
      path: '/',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <HomePage />
        </Suspense>
      ),
    },
    {
      path: '/choose-mode',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <ChooseModePage />
        </Suspense>
      ),
    },
    
    // Routes d'authentification
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
      path: '/b2b/selection',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <B2BSelectionPage />
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
    
    // Routes de tableau de bord
    {
      path: '/b2c/dashboard',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
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
    
    // Routes de fonctionnalités principales
    {
      path: '/scan',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <ScanPage />
        </Suspense>
      ),
    },
    {
      path: '/music',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <MusicPage />
        </Suspense>
      ),
    },
    {
      path: '/coach',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <CoachPage />
        </Suspense>
      ),
    },
    {
      path: '/journal',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <JournalPage />
        </Suspense>
      ),
    },
    {
      path: '/vr',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <VRPage />
        </Suspense>
      ),
    },
    {
      path: '/breathwork',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <BreathworkPage />
        </Suspense>
      ),
    },
    {
      path: '/onboarding',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <OnboardingPage />
        </Suspense>
      ),
    },
    {
      path: '/flash-glow',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <FlashGlowPage />
        </Suspense>
      ),
    },
    {
      path: '/preferences',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <PreferencesPage />
        </Suspense>
      ),
    },
    {
      path: '/gamification',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <GamificationPage />
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
    {
      path: '/profile-settings',
      element: (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <ProfileSettingsPage />
        </Suspense>
      ),
    },
    
    // Routes de jeux et activités
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
  ];
}
