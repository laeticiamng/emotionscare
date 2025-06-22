
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import PrivacyDashboardPage from '@/pages/PrivacyDashboardPage';

export const privacyRoutes: RouteObject[] = [
  {
    path: '/privacy',
    element: (
      <ProtectedRoute>
        <PageAccessGuard>
          <PrivacyDashboardPage />
        </PageAccessGuard>
      </ProtectedRoute>
    ),
  }
];
