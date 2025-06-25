
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const B2BSelectionPage = lazy(() => import('@/pages/b2b/B2BSelectionPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/B2BUserLoginPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/B2BAdminLoginPage'));
const B2BUserDashboard = lazy(() => import('@/pages/b2b/B2BUserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/B2BAdminDashboard'));

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/b2b/user/login',
    element: <B2BUserLoginPage />,
  },
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '/b2b/user/dashboard',
    element: <B2BUserDashboard />,
  },
  {
    path: '/b2b/admin/dashboard',
    element: <B2BAdminDashboard />,
  },
];
