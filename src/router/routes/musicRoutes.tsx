
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const MusicPage = lazy(() => import('@/pages/MusicPage'));
const MusicGeneratorPage = lazy(() => import('@/pages/MusicGeneratorPage'));

export const musicRoutes: RouteObject[] = [
  {
    path: '/music',
    element: <MusicPage />
  },
  {
    path: '/music-generator',
    element: <MusicGeneratorPage />
  }
];
