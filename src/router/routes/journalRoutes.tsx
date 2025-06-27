
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import JournalPage from '@/pages/JournalPage';

export const journalRoutes: RouteObject[] = [
  {
    path: '/journal',
    element: (
      <ProtectedRoute>
        <JournalPage />
      </ProtectedRoute>
    ),
  },
];
