
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DashboardRedirect = lazy(() => import('../pages/DashboardRedirect'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const B2CLayout = lazy(() => import('../layouts/B2CLayout'));
const TimelinePage = lazy(() => import('../pages/TimelinePage'));
const WorldPage = lazy(() => import('../pages/WorldPage'));
const SanctuaryPage = lazy(() => import('../pages/SanctuaryPage'));
const HomePage = lazy(() => import('../pages/Home'));

// Define routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
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
  },
  {
    path: '/timeline',
    element: <TimelinePage />
  },
  {
    path: '/world',
    element: <WorldPage />
  },
  {
    path: '/sanctuary',
    element: <SanctuaryPage />
  }
];

export default routes;
