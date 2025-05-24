
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  B2CLoginPage,
  B2CRegisterPage,
  B2CDashboardPage,
  B2COnboardingPage,
  B2CJournalPage,
  B2CMusicPage,
  B2CScanPage,
  B2CCoachPage,
  B2CVRPage,
  B2CGamificationPage,
  B2CSocialPage,
  B2CSettingsPage
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
            <B2CDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CJournalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'music',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CMusicPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'scan',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CScanPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'coach',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CCoachPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'vr',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CVRPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'gamification',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CGamificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'social',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CSocialPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredRole="b2c">
            <B2CSettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
