
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/common/Login'));
const RegisterPage = lazy(() => import('./pages/common/Register'));
const B2BSelectionPage = lazy(() => import('./pages/B2BSelectionPage'));
const B2CLayout = lazy(() => import('./layouts/B2CLayout'));
const B2BUserLayout = lazy(() => import('./layouts/B2BUserLayout'));
const B2BAdminLayout = lazy(() => import('./layouts/B2BAdminLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const B2CDashboardPage = lazy(() => import('./pages/b2c/DashboardPage'));
const B2BUserDashboardPage = lazy(() => import('./pages/b2b/user/Dashboard'));
const B2BAdminDashboardPage = lazy(() => import('./pages/b2b/admin/Dashboard'));
const B2CGamificationPage = lazy(() => import('./pages/b2c/Gamification'));
const B2BUserGamificationPage = lazy(() => import('./pages/b2b/user/Gamification'));
const ImmersiveHome = lazy(() => import('./pages/ImmersiveHome'));
const Home = lazy(() => import('./pages/Home'));

// Define the application routes without creating a router instance
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />
  },
  {
    path: '/home',
    element: <Home />
  },
  // B2C Auth Routes
  {
    path: 'b2c/login',
    element: <LoginPage />
  },
  {
    path: 'b2c/register',
    element: <RegisterPage />
  },
  // B2B Selection Route
  {
    path: 'b2b/selection',
    element: <B2BSelectionPage />
  },
  // Make sure the route with special character is also supported
  {
    path: 'b2b/sélection',
    element: <B2BSelectionPage />
  },
  // B2B Auth Routes
  {
    path: 'b2b/user/login',
    element: <LoginPage />
  },
  {
    path: 'b2b/admin/login',
    element: <LoginPage />
  },
  // B2C Protected Routes
  {
    path: 'b2c',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <B2CLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <B2CDashboardPage /> // Default route when accessing /b2c
      },
      {
        path: 'dashboard',
        element: <B2CDashboardPage />
      },
      {
        path: 'gamification',
        element: <B2CGamificationPage />
      }
    ]
  },
  // B2B User Protected Routes
  {
    path: 'b2b/user',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <B2BUserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <B2BUserDashboardPage /> // Default route when accessing /b2b/user
      },
      {
        path: 'dashboard',
        element: <B2BUserDashboardPage />
      },
      {
        path: 'gamification',
        element: <B2BUserGamificationPage />
      }
    ]
  },
  // B2B Admin Protected Routes
  {
    path: 'b2b/admin',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <B2BAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <B2BAdminDashboardPage /> // Default route when accessing /b2b/admin
      },
      {
        path: 'dashboard',
        element: <B2BAdminDashboardPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
