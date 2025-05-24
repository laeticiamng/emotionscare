
import { RouteObject, Navigate } from 'react-router-dom';
import { HomePage, ChooseModePage } from '@/utils/lazyComponents';

export const commonRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  // Redirections pour les routes obsolètes
  {
    path: '/login-collaborateur',
    element: <Navigate to="/b2b/user/login" replace />,
  },
  {
    path: '/login-admin',
    element: <Navigate to="/b2b/admin/login" replace />,
  },
  {
    path: '/login',
    element: <Navigate to="/choose-mode" replace />,
  },
  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
