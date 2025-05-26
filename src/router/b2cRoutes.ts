
import { RouteObject } from 'react-router-dom';
import React from 'react';

const B2CLogin = React.lazy(() => import('../pages/b2c/B2CLogin'));
const B2CRegister = React.lazy(() => import('../pages/b2c/B2CRegister'));
const B2CDashboard = React.lazy(() => import('../pages/b2c/B2CDashboard'));

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c/login',
    element: React.createElement(B2CLogin),
  },
  {
    path: '/b2c/register',
    element: React.createElement(B2CRegister),
  },
  {
    path: '/b2c/dashboard',
    element: React.createElement(B2CDashboard),
  },
];
