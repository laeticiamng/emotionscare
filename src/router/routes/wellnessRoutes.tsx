
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const wellnessRoutes: RouteObject[] = [
  {
    path: '/wellness',
    element: (
      <ProtectedRoute>
        <div>Wellness</div>
      </ProtectedRoute>
    ),
  },
];
