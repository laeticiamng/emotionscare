
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const B2BRedirectPage = lazy(() => import('@/pages/b2b/B2BRedirectPage'));

export const b2bRedirectRoutes: RouteObject[] = [
  {
    path: '/b2b',
    element: <B2BRedirectPage />,
  },
];
