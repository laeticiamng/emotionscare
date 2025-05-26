
import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants
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
const AuditPage = React.lazy(() => import('./pages/audit/AuditPage'));

// Layout Components
const B2CLayout = React.lazy(() => import('./layouts/B2CLayout'));
const B2BLayout = React.lazy(() => import('./layouts/B2BLayout'));

const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Component {...props} />
    </React.Suspense>
  );
};

export const routes = [
  {
    path: '/',
    element: withSuspense(Home)(),
  },
  {
    path: '/choose-mode',
    element: withSuspense(ChooseModePage)(),
  },
  {
    path: '/audit',
    element: withSuspense(AuditPage)(),
  },
  {
    path: '/b2b/selection',
    element: withSuspense(B2BSelectionPage)(),
  },
  // B2C Routes
  {
    path: '/b2c',
    element: (
      <ProtectedRoute requiredRole="b2c">
        {withSuspense(B2CLayout)()}
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'login',
        element: withSuspense(B2CLoginPage)(),
      },
      {
        path: 'register',
        element: withSuspense(B2CRegisterPage)(),
      },
      {
        path: 'dashboard',
        element: withSuspense(B2CDashboard)(),
      },
    ],
  },
  // B2B User Routes
  {
    path: '/b2b/user',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        {withSuspense(B2BLayout)()}
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'login',
        element: withSuspense(B2BUserLoginPage)(),
      },
      {
        path: 'register',
        element: withSuspense(B2BUserRegisterPage)(),
      },
      {
        path: 'dashboard',
        element: withSuspense(B2BUserDashboard)(),
      },
    ],
  },
  // B2B Admin Routes
  {
    path: '/b2b/admin',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BLayout)()}
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'login',
        element: withSuspense(B2BAdminLoginPage)(),
      },
      {
        path: 'dashboard',
        element: withSuspense(B2BAdminDashboard)(),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
