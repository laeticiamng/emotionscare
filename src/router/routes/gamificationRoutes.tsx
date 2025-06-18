
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const GamificationPage = lazy(() => import('@/pages/GamificationPage'));

export const gamificationRoutes: RouteObject[] = [
  {
    path: '/gamification',
    element: <GamificationPage />,
  },
];
