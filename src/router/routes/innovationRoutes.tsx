
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import InnovationLabPage from '@/pages/InnovationLabPage';

export const innovationRoutes: RouteObject[] = [
  {
    path: '/innovation',
    element: (
      <ProtectedRoute>
        <PageAccessGuard>
          <InnovationLabPage />
        </PageAccessGuard>
      </ProtectedRoute>
    ),
  }
];
