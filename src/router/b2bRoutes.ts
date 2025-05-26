
import { RouteObject } from 'react-router-dom';
import React from 'react';

const B2BLayout = React.lazy(() => import('../layouts/B2CLayout'));

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b',
    element: React.createElement(B2BLayout),
    children: [
      {
        path: 'dashboard',
        element: React.createElement('div', {}, 'B2B Dashboard')
      }
    ]
  }
];
