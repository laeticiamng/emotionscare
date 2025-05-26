
import { RouteObject } from 'react-router-dom';
import React from 'react';

const B2CRegister = React.lazy(() => import('../pages/b2c/B2CRegister'));
const LoginPage = React.lazy(() => import('../pages/b2c/LoginPage'));

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c/login',
    element: React.createElement(LoginPage),
  },
  {
    path: '/b2c/register',
    element: React.createElement(B2CRegister),
  },
];
