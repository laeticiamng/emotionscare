
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const EmotionsPage = lazy(() => import('@/pages/EmotionsPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));

export const featureRoutes: RouteObject[] = [
  {
    path: '/emotions',
    element: <EmotionsPage />,
  },
  {
    path: '/music',
    element: <MusicPage />,
  },
  {
    path: '/coach',
    element: <CoachPage />,
  },
  {
    path: '/journal',
    element: <JournalPage />,
  },
];
