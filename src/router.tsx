
import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des pages
const ImmersiveHome = React.lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = React.lazy(() => import('@/pages/B2BSelectionPage'));

// Pages d'authentification
const B2CLoginPage = React.lazy(() => import('@/pages/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/auth/B2CRegisterPage'));
const B2BUserLoginPage = React.lazy(() => import('@/pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('@/pages/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = React.lazy(() => import('@/pages/auth/B2BAdminLoginPage'));

// Pages de dashboard
const B2CDashboardPage = React.lazy(() => import('@/pages/dashboard/B2CDashboardPage'));
const B2BUserDashboardPage = React.lazy(() => import('@/pages/dashboard/B2BUserDashboardPage'));
const B2BAdminDashboardPage = React.lazy(() => import('@/pages/dashboard/B2BAdminDashboardPage'));

// Pages de fonctionnalités communes (CHEMINS UNIQUES)
const ScanPage = React.lazy(() => import('@/pages/ScanPage'));
const MusicPage = React.lazy(() => import('@/pages/MusicPage'));
const CoachPage = React.lazy(() => import('@/pages/CoachPage'));
const CoachChatPage = React.lazy(() => import('@/pages/CoachChatPage'));
const JournalPage = React.lazy(() => import('@/pages/JournalPage'));
const VRPage = React.lazy(() => import('@/pages/VRPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const PreferencesPage = React.lazy(() => import('@/pages/PreferencesPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const SocialCoconPage = React.lazy(() => import('@/pages/SocialCoconPage'));

// Pages administrateur uniquement
const TeamsPage = React.lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = React.lazy(() => import('@/pages/ReportsPage'));
const EventsPage = React.lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = React.lazy(() => import('@/pages/OptimisationPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ImmersiveHome />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
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
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRoute mockUserMode="b2c" mockAuthenticated={true}>
        <B2CDashboardPage />
      </ProtectedRoute>
    ),
  },

  // Routes d'authentification B2B User
  {
    path: '/b2b/user/login',
    element: <B2BUserLoginPage />,
  },
  {
    path: '/b2b/user/register',
    element: <B2BUserRegisterPage />,
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <ProtectedRoute mockUserMode="b2b_user" mockAuthenticated={true}>
        <B2BUserDashboardPage />
      </ProtectedRoute>
    ),
  },

  // Routes d'authentification B2B Admin
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin" mockUserMode="b2b_admin" mockAuthenticated={true}>
        <B2BAdminDashboardPage />
      </ProtectedRoute>
    ),
  },

  // FONCTIONNALITÉS COMMUNES - CHEMINS UNIQUES
  {
    path: '/scan',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <ScanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/music',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <MusicPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coach',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <CoachPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coach-chat',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <CoachChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/journal',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <JournalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vr',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <VRPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <PreferencesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/gamification',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <GamificationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/social-cocon',
    element: (
      <ProtectedRoute mockAuthenticated={true}>
        <SocialCoconPage />
      </ProtectedRoute>
    ),
  },

  // FONCTIONNALITÉS ADMINISTRATEUR UNIQUEMENT
  {
    path: '/teams',
    element: (
      <ProtectedRoute requiredRole="admin" mockUserMode="b2b_admin" mockAuthenticated={true}>
        <TeamsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="admin" mockUserMode="b2b_admin" mockAuthenticated={true}>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute requiredRole="admin" mockUserMode="b2b_admin" mockAuthenticated={true}>
        <EventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <ProtectedRoute requiredRole="admin" mockUserMode="b2b_admin" mockAuthenticated={true}>
        <OptimisationPage />
      </ProtectedRoute>
    ),
  },

  // Route fallback - redirection vers l'accueil
  {
    path: '*',
    element: <ImmersiveHome />,
  },
]);
