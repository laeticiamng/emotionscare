
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRoute requiredRole="b2c">
        <div>B2C Dashboard</div>
      </ProtectedRoute>
    ),
  },
];
