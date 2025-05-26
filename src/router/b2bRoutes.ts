
import { RouteObject } from 'react-router-dom';
import React from 'react';

const B2BUserLogin = React.lazy(() => import('../pages/b2b/B2BUserLogin'));
const B2BAdminLogin = React.lazy(() => import('../pages/b2b/B2BAdminLogin'));
const B2BUserDashboard = React.lazy(() => import('../pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = React.lazy(() => import('../pages/b2b/B2BAdminDashboard'));

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b/user/login',
    element: React.createElement(B2BUserLogin),
  },
  {
    path: '/b2b/admin/login',
    element: React.createElement(B2BAdminLogin),
  },
  {
    path: '/b2b/user/dashboard',
    element: React.createElement(B2BUserDashboard),
  },
  {
    path: '/b2b/admin/dashboard',
    element: React.createElement(B2BAdminDashboard),
  },
];
