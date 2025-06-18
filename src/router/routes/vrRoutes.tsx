
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const VRPage = lazy(() => import('@/pages/VRPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));

export const vrRoutes: RouteObject[] = [
  {
    path: '/vr',
    element: (
      <ProtectedRoute>
        <VRPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/meditation',
    element: (
      <ProtectedRoute>
        <MeditationPage />
      </ProtectedRoute>
    ),
  },
];
