
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const MusicPage = lazy(() => import('@/pages/MusicPage'));

export const musicRoutes: RouteObject[] = [
  {
    path: '/music',
    element: <MusicPage />
  }
];
