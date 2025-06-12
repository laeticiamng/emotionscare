
import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';
import { b2bAdminRoutes } from './router/b2bAdminRoutes';
import { b2bUserRoutes } from './router/b2bUserRoutes';
import { b2cRoutes } from './router/b2cRoutes';

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
const GlowBreathPage = React.lazy(() => import('./pages/GlowBreathPage'));

// Pages supplémentaires B2C
const B2CJournal = React.lazy(() => import('./pages/b2c/B2CJournal'));
const B2CScan = React.lazy(() => import('./pages/b2c/B2CScan'));
const B2CMusic = React.lazy(() => import('./pages/b2c/B2CMusic'));
const B2CCoach = React.lazy(() => import('./pages/b2c/B2CCoach'));
const B2CVR = React.lazy(() => import('./pages/b2c/B2CVR'));
const B2CSettings = React.lazy(() => import('./pages/b2c/B2CSettings'));

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
  // Routes B2C existantes
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
  {
    path: '/b2c/journal',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CJournal)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/scan',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CScan)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/music',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CMusic)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/coach',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CCoach)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/vr',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CVR)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2c/settings',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CSettings)()}
      </ProtectedRoute>
    ),
  },
  // Routes B2B User existantes
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
  // Routes B2B Admin existantes
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
  // Route protégée générale
  {
    path: '/glow-breath',
    element: (
      <ProtectedRoute>
        {withSuspense(GlowBreathPage)()}
      </ProtectedRoute>
    ),
  },
  // Routes B2B supplémentaires depuis les modules de routage
  ...b2bAdminRoutes,
  ...b2bUserRoutes,
  ...b2cRoutes,
]);
