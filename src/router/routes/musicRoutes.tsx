
import { RouteObject } from 'react-router-dom';
import MusicPage from '@/pages/MusicPage';

export const musicRoutes: RouteObject[] = [
  {
    path: '/music',
    element: <MusicPage />
  }
];
