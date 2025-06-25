
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const journalRoutes: RouteObject[] = [
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        <div>Journal</div>
      </ProtectedRoute>
    ),
  },
];
