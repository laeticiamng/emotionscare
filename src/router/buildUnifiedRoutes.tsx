
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import FullPageLoader from '@/components/FullPageLoader';

// Pages principales
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));

// Pages B2C
const B2CLoginPage = lazy(() => import('@/pages/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/B2CDashboardPage'));

// Pages B2B
const B2BSelectionPage = lazy(() => import('@/pages/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/B2BUserLoginPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/B2BUserDashboardPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/B2BAdminDashboardPage'));

// Pages de fonctionnalités
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = lazy(() => import('@/pages/SocialCoconPage'));

// Pages administrateur
const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Pages de support et système
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
const SystemAuditPage = lazy(() => import('@/pages/SystemAuditPage'));
const InnovationLabPage = lazy(() => import('@/pages/InnovationLabPage'));
const PrivacyDashboardPage = lazy(() => import('@/pages/PrivacyDashboardPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));

// Wrapper pour les composants lazy avec loading
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<FullPageLoader show={true} message="Chargement..." />}>
    {children}
  </Suspense>
);

export const buildUnifiedRoutes = (): RouteObject[] => [
  // Routes publiques
  {
    path: '/',
    element: <LazyWrapper><HomePage /></LazyWrapper>,
  },
  {
    path: '/choose-mode',
    element: <LazyWrapper><ChooseModePage /></LazyWrapper>,
  },
  {
    path: '/auth',
    element: <LazyWrapper><AuthPage /></LazyWrapper>,
  },
  {
    path: '/b2b/selection',
    element: <LazyWrapper><B2BSelectionPage /></LazyWrapper>,
  },

  // Routes d'authentification B2C
  {
    path: '/b2c/login',
    element: <LazyWrapper><B2CLoginPage /></LazyWrapper>,
  },
  {
    path: '/b2c/register',
    element: <LazyWrapper><B2CRegisterPage /></LazyWrapper>,
  },

  // Routes d'authentification B2B
  {
    path: '/b2b/user/login',
    element: <LazyWrapper><B2BUserLoginPage /></LazyWrapper>,
  },
  {
    path: '/b2b/admin/login',
    element: <LazyWrapper><B2BAdminLoginPage /></LazyWrapper>,
  },

  // Dashboards protégés
  {
    path: '/b2c/dashboard',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <B2CDashboardPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <B2BUserDashboardPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <B2BAdminDashboardPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },

  // Fonctionnalités communes protégées
  {
    path: '/scan',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <ScanPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/music',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <MusicPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/coach',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <CoachPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/journal',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <JournalPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/vr',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <VRPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/meditation',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <MeditationPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/preferences',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <PreferencesPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/gamification',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <GamificationPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/social-cocon',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <SocialCoconPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },

  // Fonctionnalités administrateur
  {
    path: '/teams',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <TeamsPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/reports',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/events',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <EventsPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <OptimisationPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/settings',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },

  // Pages de support et système
  {
    path: '/security',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <SecurityPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/accessibility',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <AccessibilityPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/system-audit',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <SystemAuditPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/innovation-lab',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <InnovationLabPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/privacy-dashboard',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <PrivacyDashboardPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/help-center',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <HelpCenterPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
  {
    path: '/feedback',
    element: (
      <LazyWrapper>
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      </LazyWrapper>
    ),
  },
];
