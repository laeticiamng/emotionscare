
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const GamificationModule = lazy(() => import('@/pages/modules/GamificationModule'));
const VRExperienceModule = lazy(() => import('@/pages/modules/VRExperienceModule'));

export const moduleRoutes: RouteObject[] = [
  {
    path: '/modules/gamification',
    element: <GamificationModule />,
  },
  {
    path: '/modules/vr',
    element: <VRExperienceModule />,
  },
  // Routes pour différents modes utilisateur
  {
    path: '/b2c/gamification',
    element: <GamificationModule />,
  },
  {
    path: '/b2c/vr',
    element: <VRExperienceModule />,
  },
  {
    path: '/b2b/user/gamification',
    element: <GamificationModule />,
  },
  {
    path: '/b2b/user/vr',
    element: <VRExperienceModule />,
  },
];
