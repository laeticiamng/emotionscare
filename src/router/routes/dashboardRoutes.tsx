
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));
const B2BUserDashboard = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <B2CDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_user">
        <B2BUserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <B2BAdminDashboard />
      </ProtectedRoute>
    ),
  },
];
