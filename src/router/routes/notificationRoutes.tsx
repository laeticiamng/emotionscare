
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const NotificationDemoPage = lazy(() => import('@/pages/NotificationDemoPage'));

export const notificationRoutes: RouteObject[] = [
  {
    path: '/notifications',
    element: <NotificationDemoPage />,
  },
  {
    path: '/notifications/demo',
    element: <NotificationDemoPage />,
  },
];
