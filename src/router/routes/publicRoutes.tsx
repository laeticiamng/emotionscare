
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const SimpleHome = lazy(() => import('@/pages/SimpleHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <SimpleHome />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
];
