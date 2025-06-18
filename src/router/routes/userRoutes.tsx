
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const B2CLoginPage = lazy(() => import('@/pages/b2c/LoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/RegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/DashboardPage'));

const B2BSelectionPage = lazy(() => import('@/pages/b2b/SelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/LoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/RegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/DashboardPage'));

const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/LoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/DashboardPage'));

export const userRoutes: RouteObject[] = [
  // B2C Routes
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
      <ProtectedRoute requiredRole="b2c">
        <B2CDashboardPage />
      </ProtectedRoute>
    ),
  },
  // B2B Routes
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
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
      <ProtectedRoute requiredRole="b2b_user">
        <B2BUserDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <B2BAdminDashboardPage />
      </ProtectedRoute>
    ),
  },
];
