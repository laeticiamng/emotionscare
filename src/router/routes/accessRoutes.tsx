
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AccessDiagnosticPage from '@/pages/AccessDiagnosticPage';

export const accessRoutes: RouteObject[] = [
  {
    path: '/access-diagnostic',
    element: (
      <ProtectedRoute>
        <AccessDiagnosticPage />
      </ProtectedRoute>
    ),
  }
];
