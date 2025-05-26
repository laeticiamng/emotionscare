
import { RouteObject } from 'react-router-dom';
import React from 'react';

const ImmersiveHome = React.lazy(() => import('../pages/ImmersiveHome'));
const ChooseModePage = React.lazy(() => import('../pages/ChooseModePage'));

export const commonRoutes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(ImmersiveHome),
  },
  {
    path: '/choose-mode',
    element: React.createElement(ChooseModePage),
  },
];
