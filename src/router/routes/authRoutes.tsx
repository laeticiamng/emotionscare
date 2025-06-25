
import { RouteObject } from 'react-router-dom';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <div>Login Page</div>,
  },
  {
    path: '/register',
    element: <div>Register Page</div>,
  },
  {
    path: '/forgot-password',
    element: <div>Forgot Password Page</div>,
  },
  {
    path: '/reset-password',
    element: <div>Reset Password Page</div>,
  },
];
