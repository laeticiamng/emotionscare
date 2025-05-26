
import { RouteObject } from 'react-router-dom';
import React from 'react';

const B2BSelectionPage = React.lazy(() => import('../pages/B2BSelectionPage'));
const B2BAdminLogin = React.lazy(() => import('../pages/b2b/B2BAdminLogin'));

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b/selection',
    element: React.createElement(B2BSelectionPage),
  },
  {
    path: '/b2b/admin/login',
    element: React.createElement(B2BAdminLogin),
  },
];
