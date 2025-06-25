
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import CompleteAuditPage from '@/pages/CompleteAuditPage';

export const auditCompleteRoutes: RouteObject[] = [
  {
    path: '/complete-audit',
    element: (
      <ProtectedRoute allowedRoles={['b2b_admin']}>
        <CompleteAuditPage />
      </ProtectedRoute>
    ),
  }
];
