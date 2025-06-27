
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnifiedRouteGuard from '@/components/routing/UnifiedRouteGuard';
import { useAuth } from '@/contexts/AuthContext';

// Pages publiques
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

// Pages d'authentification B2C
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));

// Pages d'authentification B2B
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));

// Dashboards
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));

// Fonctionnalités mesure & adaptation
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));
const BreathworkPage = lazy(() => import('@/pages/BreathworkPage'));
const InstantGlowPage = lazy(() => import('@/pages/InstantGlowPage'));

// Expériences immersives
const VRPage = lazy(() => import('@/pages/VRPage'));

// Ambition & progression
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const WeeklyBarsPage = lazy(() => import('@/pages/WeeklyBarsPage'));
const HeatmapVibesPage = lazy(() => import('@/pages/HeatmapVibesPage'));

// Espaces utilisateurs
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const ActivityHistoryPage = lazy(() => import('@/pages/ActivityHistoryPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Pages utilisateur avancées
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const AccountDeletePage = lazy(() => import('@/pages/AccountDeletePage'));
const ExportCSVPage = lazy(() => import('@/pages/ExportCSVPage'));
const PrivacyTogglesPage = lazy(() => import('@/pages/PrivacyTogglesPage'));
const HealthCheckBadgePage = lazy(() => import('@/pages/HealthCheckBadgePage'));

// Pages B2B
const B2BPage = lazy(() => import('@/pages/B2BPage'));
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));

export const buildUnifiedRoutes = (): RouteObject[] => {
  return [
    // Routes publiques
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/choose-mode',
      element: <ChooseModePage />,
    },

    // Routes d'authentification B2C
    {
      path: '/b2c/login',
      element: <B2CLoginPage />,
    },
    {
      path: '/b2c/register',
      element: <B2CRegisterPage />,
    },

    // Routes d'authentification B2B
    {
      path: '/b2b/user/login',
      element: <B2BUserLoginPage />,
    },
    {
      path: '/b2b/user/register',
      element: <B2BUserRegisterPage />,
    },
    {
      path: '/b2b/admin/login',
      element: <B2BAdminLoginPage />,
    },

    // Dashboards protégés
    {
      path: '/b2c/dashboard',
      element: (
        <UnifiedRouteGuard allowedRoles={['b2c']}>
          <B2CDashboardPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/b2b/user/dashboard',
      element: (
        <UnifiedRouteGuard allowedRoles={['b2b_user']}>
          <B2BUserDashboardPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/b2b/admin/dashboard',
      element: (
        <UnifiedRouteGuard allowedRoles={['b2b_admin']}>
          <B2BAdminDashboardPage />
        </UnifiedRouteGuard>
      ),
    },

    // Fonctionnalités mesure & adaptation (protégées)
    {
      path: '/scan',
      element: (
        <UnifiedRouteGuard>
          <ScanPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/music',
      element: (
        <UnifiedRouteGuard>
          <MusicPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/flash-glow',
      element: (
        <UnifiedRouteGuard>
          <FlashGlowPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/boss-level-grit',
      element: (
        <UnifiedRouteGuard>
          <BossLevelGritPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/mood-mixer',
      element: (
        <UnifiedRouteGuard>
          <MoodMixerPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/bounce-back-battle',
      element: (
        <UnifiedRouteGuard>
          <BounceBackBattlePage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/breathwork',
      element: (
        <UnifiedRouteGuard>
          <BreathworkPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/instant-glow',
      element: (
        <UnifiedRouteGuard>
          <InstantGlowPage />
        </UnifiedRouteGuard>
      ),
    },

    // Expériences immersives
    {
      path: '/vr',
      element: (
        <UnifiedRouteGuard>
          <VRPage />
        </UnifiedRouteGuard>
      ),
    },

    // Ambition & progression
    {
      path: '/ambition-arcade',
      element: (
        <UnifiedRouteGuard>
          <AmbitionArcadePage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/weekly-bars',
      element: (
        <UnifiedRouteGuard>
          <WeeklyBarsPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/heatmap-vibes',
      element: (
        <UnifiedRouteGuard>
          <HeatmapVibesPage />
        </UnifiedRouteGuard>
      ),
    },

    // Espaces utilisateurs
    {
      path: '/onboarding',
      element: (
        <UnifiedRouteGuard>
          <OnboardingPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/social-cocon',
      element: (
        <UnifiedRouteGuard>
          <SocialCoconPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/profile-settings',
      element: (
        <UnifiedRouteGuard>
          <ProfileSettingsPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/activity-history',
      element: (
        <UnifiedRouteGuard>
          <ActivityHistoryPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/preferences',
      element: (
        <UnifiedRouteGuard>
          <PreferencesPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/notifications',
      element: (
        <UnifiedRouteGuard>
          <NotificationsPage />
        </UnifiedRouteGuard>
      ),
    },

    // Pages utilisateur avancées
    {
      path: '/feedback',
      element: (
        <UnifiedRouteGuard>
          <FeedbackPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/account-delete',
      element: (
        <UnifiedRouteGuard>
          <AccountDeletePage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/export-csv',
      element: (
        <UnifiedRouteGuard>
          <ExportCSVPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/privacy-toggles',
      element: (
        <UnifiedRouteGuard>
          <PrivacyTogglesPage />
        </UnifiedRouteGuard>
      ),
    },
    {
      path: '/health-check-badge',
      element: (
        <UnifiedRouteGuard>
          <HealthCheckBadgePage />
        </UnifiedRouteGuard>
      ),
    },

    // Pages B2B
    {
      path: '/b2b',
      element: <B2BPage />,
    },
    {
      path: '/b2b/selection',
      element: <B2BSelectionPage />,
    },
  ];
};
