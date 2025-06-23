
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PageAccessGuard from '@/components/access/PageAccessGuard';
import FeedbackPage from '@/pages/FeedbackPage';

export const feedbackRoutes: RouteObject[] = [
  {
    path: '/feedback',
    element: (
      <ProtectedRoute>
        <PageAccessGuard>
          <FeedbackPage />
        </PageAccessGuard>
      </ProtectedRoute>
    ),
  }
];
