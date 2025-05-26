
import { RouteObject } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  B2BUserLoginPage,
  B2BUserRegisterPage,
  B2BUserDashboardPage,
  B2BUserScanPage,
  B2BUserCoachPage,
  B2BUserMusicPage,
  B2BAdminLoginPage,
  B2BAdminDashboardPage
} from '@/utils/lazyComponents';

export const b2bRoutes: RouteObject[] = [
  {
    path: '/b2b',
    children: [
      // B2B User Routes
      {
        path: 'user',
        children: [
          {
            path: 'login',
            element: <B2BUserLoginPage />,
          },
          {
            path: 'register',
            element: <B2BUserRegisterPage />,
          },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute requiredRole="b2b_user">
                <MainLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <B2BUserDashboardPage />,
              },
            ],
          },
          {
            path: 'scan',
            element: (
              <ProtectedRoute requiredRole="b2b_user">
                <MainLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <B2BUserScanPage />,
              },
            ],
          },
          {
            path: 'coach',
            element: (
              <ProtectedRoute requiredRole="b2b_user">
                <MainLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <B2BUserCoachPage />,
              },
            ],
          },
          {
            path: 'music',
            element: (
              <ProtectedRoute requiredRole="b2b_user">
                <MainLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <B2BUserMusicPage />,
              },
            ],
          },
        ],
      },
      // B2B Admin Routes
      {
        path: 'admin',
        children: [
          {
            path: 'login',
            element: <B2BAdminLoginPage />,
          },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute requiredRole="b2b_admin">
                <MainLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <B2BAdminDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
