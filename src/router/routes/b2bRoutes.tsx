
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const B2BDashboard = lazy(() => import('@/pages/b2b/DashboardPage'));

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b',
    element: (
      <ProtectedRoute>
        <B2BDashboard />
      </ProtectedRoute>
    ),
  },
];
