
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));

export const homeRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
];
