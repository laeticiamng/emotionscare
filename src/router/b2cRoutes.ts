
import { RouteObject } from 'react-router-dom';

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c',
    children: [
      {
        path: 'dashboard',
        element: <div>Dashboard B2C</div>,
      },
      {
        path: 'login',
        element: <div>Login B2C</div>,
      },
      {
        path: 'register',
        element: <div>Register B2C</div>,
      },
    ],
  },
];
