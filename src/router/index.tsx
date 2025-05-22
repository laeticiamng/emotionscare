
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
const ImmersiveHome = lazy(() => import('../pages/ImmersiveHome'));
const B2CDashboardPage = lazy(() => import('../pages/b2c/DashboardPage'));
const BusinessPage = lazy(() => import('../pages/BusinessPage'));
const B2BSelection = lazy(() => import('../pages/common/B2BSelection'));
const CollaboratorLoginPage = lazy(() => import('../pages/b2b/user/Login'));
const CollaboratorRegisterPage = lazy(() => import('../pages/b2b/user/Register'));
const AdminLoginPage = lazy(() => import('../pages/b2b/admin/Login'));
const ChooseMode = lazy(() => import('../pages/common/ChooseMode'));

// Define routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'dashboard',
        element: <B2CDashboardPage />
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
  },
  {
    path: '/b2b/selection',
    element: <B2BSelection />
  },
  {
    path: '/login-collaborateur',
    element: <CollaboratorLoginPage />
  },
  {
    path: '/login-admin',
    element: <AdminLoginPage />
  },
  {
    path: '/b2b/user/register',
    element: <CollaboratorRegisterPage />
  },
  {
    path: '/choose-mode',
    element: <ChooseMode />
  },
  {
    path: '/business',
    element: <BusinessPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  }
];

export default routes;
