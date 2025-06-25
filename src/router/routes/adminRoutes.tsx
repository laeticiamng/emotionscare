
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import SecureRouteGuard from '@/components/security/SecureRouteGuard';

const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/teams',
    element: (
      <SecureRouteGuard allowedRoles={['b2b_admin', 'admin']}>
        <TeamsPage />
      </SecureRouteGuard>
    ),
  },
  {
    path: '/reports',
    element: (
      <SecureRouteGuard allowedRoles={['b2b_admin', 'admin']}>
        <ReportsPage />
      </SecureRouteGuard>
    ),
  },
  {
    path: '/events',
    element: (
      <SecureRouteGuard allowedRoles={['b2b_admin', 'admin']}>
        <EventsPage />
      </SecureRouteGuard>
    ),
  },
  {
    path: '/optimisation',
    element: (
      <SecureRouteGuard allowedRoles={['b2b_admin', 'admin']}>
        <OptimisationPage />
      </SecureRouteGuard>
    ),
  },
];
