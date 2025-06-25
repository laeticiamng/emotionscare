
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const coachRoutes: RouteObject[] = [
  {
    path: '/coach/dashboard',
    element: (
      <ProtectedRoute requiredRole="coach">
        <div>Coach Dashboard</div>
      </ProtectedRoute>
    ),
  },
];
