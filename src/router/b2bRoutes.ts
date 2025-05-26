
import { RouteObject } from 'react-router-dom';

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b',
    children: [
      {
        path: 'user/dashboard',
        element: <div>Dashboard B2B User</div>,
      },
      {
        path: 'admin/dashboard',
        element: <div>Dashboard B2B Admin</div>,
      },
      {
        path: 'user/login',
        element: <div>Login B2B User</div>,
      },
      {
        path: 'admin/login',
        element: <div>Login B2B Admin</div>,
      },
    ],
  },
];
