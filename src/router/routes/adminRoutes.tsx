
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const TeamsPage = lazy(() => import('@/pages/TeamsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const OptimisationPage = lazy(() => import('@/pages/OptimisationPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/teams',
    element: <TeamsPage />,
  },
  {
    path: '/reports',  
    element: <ReportsPage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/optimisation',
    element: <OptimisationPage />,
  },
];
