
import { RouteObject } from 'react-router-dom';

export const userRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <div data-testid="page-root"><h1>Login général - Page en construction</h1></div>,
  },
  {
    path: '/reset-password',
    element: <div data-testid="page-root"><h1>Reset Password - Page en construction</h1></div>,
  },
  {
    path: '/auth/callback',
    element: <div data-testid="page-root"><h1>Auth Callback - Page en construction</h1></div>,
  },
];
