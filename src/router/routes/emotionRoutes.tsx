
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const emotionRoutes: RouteObject[] = [
  {
    path: '/emotions',
    element: (
      <ProtectedRoute>
        <div>Emotions</div>
      </ProtectedRoute>
    ),
  },
];
