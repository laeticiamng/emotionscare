
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/teams',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <TeamsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <EventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <OptimisationPage />
      </ProtectedRoute>
    ),
  },
];
