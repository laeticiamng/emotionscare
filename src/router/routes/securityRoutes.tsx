
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import SecurityPage from '@/pages/SecurityPage';

export const securityRoutes: RouteObject[] = [
  {
    path: '/security',
    element: (
      <ProtectedRoute>
        <SecurityPage />
      </ProtectedRoute>
    ),
  }
];
