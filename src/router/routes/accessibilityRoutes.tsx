
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import AccessibilityPage from '@/pages/AccessibilityPage';

export const accessibilityRoutes: RouteObject[] = [
  {
    path: '/accessibility',
    element: (
      <ProtectedRoute>
        <PageAccessGuard>
          <AccessibilityPage />
        </PageAccessGuard>
      </ProtectedRoute>
    ),
  }
];
