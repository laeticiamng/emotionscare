
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GamificationPage } from '@/pages/GamificationPage';

export const gamificationRoutes: RouteObject[] = [
  {
    path: '/gamification',
    element: (
      <ProtectedRoute>
        <GamificationPage />
      </ProtectedRoute>
    ),
  }
];
