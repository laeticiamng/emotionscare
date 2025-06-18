
import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants principaux
const Home = React.lazy(() => import('./Home'));
const ChooseModePage = React.lazy(() => import('./pages/auth/ChooseModePage'));
const B2CLoginPage = React.lazy(() => import('./pages/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('./pages/auth/B2CRegisterPage'));
const B2CDashboard = React.lazy(() => import('./pages/b2c/B2CDashboard'));
const B2BSelectionPage = React.lazy(() => import('./pages/auth/B2BSelectionPage'));
const B2BUserLoginPage = React.lazy(() => import('./pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('./pages/auth/B2BUserRegisterPage'));
const B2BUserDashboard = React.lazy(() => import('./pages/b2b/user/B2BUserDashboard'));
const B2BAdminLoginPage = React.lazy(() => import('./pages/auth/B2BAdminLoginPage'));
const B2BAdminDashboard = React.lazy(() => import('./pages/b2b/admin/B2BAdminDashboard'));

// Pages communes (un seul chemin par fonctionnalité)
const ScanPage = React.lazy(() => import('./pages/ScanPage'));
const MusicPage = React.lazy(() => import('./pages/MusicPage'));
const CoachPage = React.lazy(() => import('./pages/CoachPage'));
const CoachChatPage = React.lazy(() => import('./pages/CoachChatPage'));
const JournalPage = React.lazy(() => import('./pages/JournalPage'));
const VRPage = React.lazy(() => import('./pages/VRPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const PreferencesPage = React.lazy(() => import('./pages/PreferencesPage'));
const GamificationPage = React.lazy(() => import('./pages/GamificationPage'));
const SocialCoconPage = React.lazy(() => import('./pages/SocialCoconPage'));

// Pages spécifiques B2B Admin
const B2BAdminTeamsPage = React.lazy(() => import('./pages/b2b/admin/TeamsPage'));
const B2BAdminReportsPage = React.lazy(() => import('./pages/b2b/admin/ReportsPage'));
const B2BAdminEventsPage = React.lazy(() => import('./pages/b2b/admin/EventsPage'));
const B2BAdminOptimisationPage = React.lazy(() => import('./pages/b2b/admin/OptimisationPage'));

const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Component {...props} />
    </React.Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(Home)(),
  },
  {
    path: '/choose-mode',
    element: withSuspense(ChooseModePage)(),
  },
  {
    path: '/b2b/selection',
    element: withSuspense(B2BSelectionPage)(),
  },
  
  // Routes d'authentification B2C
  {
    path: '/b2c/login',
    element: withSuspense(B2CLoginPage)(),
  },
  {
    path: '/b2c/register',
    element: withSuspense(B2CRegisterPage)(),
  },
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CDashboard)()}
      </ProtectedRoute>
    ),
  },
  
  // Routes d'authentification B2B User
  {
    path: '/b2b/user/login',
    element: withSuspense(B2BUserLoginPage)(),
  },
  {
    path: '/b2b/user/register',
    element: withSuspense(B2BUserRegisterPage)(),
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BUserDashboard)()}
      </ProtectedRoute>
    ),
  },
  
  // Routes d'authentification B2B Admin
  {
    path: '/b2b/admin/login',
    element: withSuspense(B2BAdminLoginPage)(),
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminDashboard)()}
      </ProtectedRoute>
    ),
  },

  // ROUTES COMMUNES - UN SEUL CHEMIN PAR FONCTIONNALITÉ
  {
    path: '/scan',
    element: (
      <ProtectedRoute>
        {withSuspense(ScanPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/music',
    element: (
      <ProtectedRoute>
        {withSuspense(MusicPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/coach',
    element: (
      <ProtectedRoute>
        {withSuspense(CoachPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/coach-chat',
    element: (
      <ProtectedRoute>
        {withSuspense(CoachChatPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        {withSuspense(JournalPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/vr',
    element: (
      <ProtectedRoute>
        {withSuspense(VRPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        {withSuspense(SettingsPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/preferences',
    element: (
      <ProtectedRoute>
        {withSuspense(PreferencesPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/gamification',
    element: (
      <ProtectedRoute>
        {withSuspense(GamificationPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/social-cocon',
    element: (
      <ProtectedRoute>
        {withSuspense(SocialCoconPage)()}
      </ProtectedRoute>
    ),
  },

  // ROUTES SPÉCIFIQUES B2B ADMIN UNIQUEMENT
  {
    path: '/teams',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminTeamsPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminReportsPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminEventsPage)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminOptimisationPage)()}
      </ProtectedRoute>
    ),
  },
]);
