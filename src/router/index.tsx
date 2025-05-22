
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DashboardRedirect = lazy(() => import('../pages/DashboardRedirect'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const B2CLayout = lazy(() => import('../layouts/B2CLayout'));

// Define routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardRedirect />
  },
  {
    path: '/b2c',
    element: <B2CLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ]
  }
];

export default routes;
