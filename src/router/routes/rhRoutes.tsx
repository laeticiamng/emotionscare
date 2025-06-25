
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const rhRoutes: RouteObject[] = [
  {
    path: '/rh',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <div>RH Dashboard</div>
      </ProtectedRoute>
    ),
  },
];
