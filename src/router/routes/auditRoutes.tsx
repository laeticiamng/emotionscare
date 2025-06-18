
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AuditPage = lazy(() => import('@/pages/AuditPage'));

export const auditRoutes: RouteObject[] = [
  {
    path: '/audit',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <AuditPage />
      </ProtectedRoute>
    ),
  },
];
