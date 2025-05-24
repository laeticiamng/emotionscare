
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// B2C Pages
const B2CLoginPage = React.lazy(() => import('@/pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('@/pages/b2c/auth/B2CRegisterPage'));
const B2CResetPasswordPage = React.lazy(() => import('@/pages/b2c/auth/B2CResetPasswordPage'));
const B2CDashboardPage = React.lazy(() => import('@/pages/b2c/dashboard/B2CDashboardPage'));
const B2COnboardingPage = React.lazy(() => import('@/pages/b2c/onboarding/B2COnboardingPage'));

// B2B Pages
const B2BRoleSelectionPage = React.lazy(() => import('@/pages/b2b/selection/B2BRoleSelectionPage'));

// Other Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ChooseModePage = React.lazy(() => import('@/pages/auth/ChooseModeFlow'));

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  
  // B2C Routes
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <B2CLoginPage />,
      },
      {
        path: 'register',
        element: <B2CRegisterPage />,
      },
      {
        path: 'reset-password',
        element: <B2CResetPasswordPage />,
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2COnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <B2CDashboardPage />,
          },
        ],
      },
    ],
  },
  
  // B2B Routes
  {
    path: '/b2b',
    children: [
      {
        path: 'selection',
        element: <B2BRoleSelectionPage />,
      },
    ],
  },
  
  // Redirections pour les anciennes routes
  {
    path: '/login-collaborateur',
    element: <Navigate to="/b2b/user/login" replace />,
  },
  {
    path: '/login-admin',
    element: <Navigate to="/b2b/admin/login" replace />,
  },
  {
    path: '/login',
    element: <Navigate to="/choose-mode" replace />,
  },
  
  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default routes;
