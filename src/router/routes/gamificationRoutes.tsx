
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const BossLevelGritPage = lazy(() => import('@/pages/BossLevelGritPage'));
const MoodMixerPage = lazy(() => import('@/pages/MoodMixerPage'));
const AmbitionArcadePage = lazy(() => import('@/pages/AmbitionArcadePage'));
const BounceBackBattlePage = lazy(() => import('@/pages/BounceBackBattlePage'));

export const gamificationRoutes: RouteObject[] = [
  {
    path: 'boss-level-grit',
    element: <BossLevelGritPage />,
  },
  {
    path: 'mood-mixer', 
    element: <MoodMixerPage />,
  },
  {
    path: 'ambition-arcade',
    element: <AmbitionArcadePage />,
  },
  {
    path: 'bounce-back-battle',
    element: <BounceBackBattlePage />,
  }
];
