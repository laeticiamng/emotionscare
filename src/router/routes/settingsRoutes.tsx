
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <div>Settings</div>
      </ProtectedRoute>
    ),
  },
];
