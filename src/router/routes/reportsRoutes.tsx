
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import ReportsPage from '@/pages/ReportsPage';

export const reportsRoutes: RouteObject[] = [
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <PageAccessGuard>
          <ReportsPage />
        </PageAccessGuard>
      </ProtectedRoute>
    ),
  }
];
