
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

export const b2bRedirectRoutes: RouteObject[] = [
  {
    path: '/b2b',
    element: <Navigate to="/b2b/selection" replace />,
  },
];
