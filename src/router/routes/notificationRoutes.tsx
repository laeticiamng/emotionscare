
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import NotificationsPage from '@/pages/NotificationsPage';

export const notificationRoutes: RouteObject[] = [
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <PageAccessGuard>
          <NotificationsPage />
        </PageAccessGuard>
      </ProtectedRoute>
    ),
  }
];
