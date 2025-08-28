
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/motivation/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/motivation/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/motivation/BounceBackBattlePage'));
const StoryLabPage = lazy(() => import('@/pages/StoryLabPage'));
const FlashGlowPage = lazy(() => import('@/pages/FlashGlowPage'));
const FaceFilterPage = lazy(() => import('@/pages/FaceFilterPage'));
const BubbleBeatPage = lazy(() => import('@/pages/BubbleBeatPage'));

export const gamificationRoutes: RouteObject[] = [
  {
    path: '/boss-level-grit',
    element: <BossLevelGritPage />,
  },
  {
    path: '/mood-mixer', 
    element: <MoodMixerPage />,
  },
  {
    path: '/ambition-arcade',
    element: <AmbitionArcadePage />,
  },
  {
    path: '/bounce-back-battle',
    element: <BounceBackBattlePage />,
  },
  {
    path: '/story-lab',
    element: <StoryLabPage />,
  },
  {
    path: '/flash-glow',
    element: <FlashGlowPage />,
  },
  {
    path: '/face-filter',
    element: <FaceFilterPage />,
  },
  {
    path: '/bubble-beat',
    element: <BubbleBeatPage />,
  }
];
