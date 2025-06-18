
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import TestHome from '@/pages/TestHome';

const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <TestHome />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
];
