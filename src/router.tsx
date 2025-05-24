
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  B2CLoginPage,
  B2CRegisterPage,
  B2CResetPasswordPage,
  B2CDashboardPage,
  B2COnboardingPage,
  B2BSelectionPage,
  B2BUserLoginPage,
  B2BUserRegisterPage,
  B2BUserDashboardPage,
  B2BUserScanPage,
  B2BUserCoachPage,
  B2BUserMusicPage,
  B2BAdminLoginPage,
  B2BAdminDashboardPage,
  HomePage,
  ChooseModePage
} from '@/utils/lazyComponents';

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  
  // B2C Routes
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
  
  // B2B Routes
  {
    path: '/b2b',
    children: [
      {
        path: 'selection',
        element: <B2BSelectionPage />,
      },
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

export default routes;
