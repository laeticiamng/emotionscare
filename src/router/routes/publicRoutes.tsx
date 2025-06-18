
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <ImmersiveHome />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
];
