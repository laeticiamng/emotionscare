
import { RouteObject } from 'react-router-dom';
import React from 'react';

const B2CLayout = React.lazy(() => import('../layouts/B2CLayout'));

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c',
    element: React.createElement(B2CLayout),
    children: [
      {
        path: 'dashboard',
        element: React.createElement('div', {}, 'B2C Dashboard')
      }
    ]
  }
];
