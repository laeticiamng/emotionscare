
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const B2CHomePage = lazy(() => import('@/pages/b2c/B2CHomePage'));
const B2CLoginPage = lazy(() => import('@/pages/b2c/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/B2CRegisterPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/B2CDashboardPage'));

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c',
    element: <B2CHomePage />,
  },
  {
    path: '/b2c/login',
    element: <B2CLoginPage />,
  },
  {
    path: '/b2c/register',
    element: <B2CRegisterPage />,
  },
  {
    path: '/b2c/dashboard',
    element: <B2CDashboardPage />,
  },
];
