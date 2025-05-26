
import { RouteObject } from 'react-router-dom';
import React from 'react';

const Home = React.lazy(() => import('../Home'));

export const commonRoutes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(Home),
  },
];
