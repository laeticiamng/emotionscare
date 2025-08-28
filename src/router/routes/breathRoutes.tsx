import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const BreathPage = lazy(() => import('@/pages/BreathPage'));

export const breathRoutes: RouteObject[] = [
  {
    path: '/breath',
    element: (
      <ProtectedRoute>
        <BreathPage />
      </ProtectedRoute>
    ),
  },
];