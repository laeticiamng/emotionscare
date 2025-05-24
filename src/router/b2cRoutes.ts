
import { RouteObject } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  B2CLoginPage,
  B2CRegisterPage,
  B2CResetPasswordPage,
  B2CDashboardPage,
  B2COnboardingPage
} from '@/utils/lazyComponents';

export const b2cRoutes: RouteObject[] = [
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <B2CLoginPage />,
      },
      {
        path: 'register',
        element: <B2CRegisterPage />,
      },
      {
        path: 'reset-password',
        element: <B2CResetPasswordPage />,
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2COnboardingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <B2CDashboardPage />,
          },
        ],
      },
    ],
  },
];
