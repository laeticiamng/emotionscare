import { RouteObject } from 'react-router-dom';
import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import UserDashboard from '@/components/dashboard/UserDashboard';
import UserSettings from '@/components/settings/UserSettings';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';
import ScanPage from '@/pages/ScanPage';
import VrPage from '@/pages/VrPage';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const ChooseModePage = React.lazy(() => import('@/pages/ChooseModePage'));

export const b2cRoutes: RouteObject[] = [
  {
    path: '/choose-mode',
    element: React.createElement(ChooseModePage),
  },
  {
    path: '/b2c/login',
    element: React.createElement(LoginPage),
  },
  {
    path: '/b2c/register',
    element: React.createElement(RegisterPage),
  },
  {
    path: '/b2c',
    element: React.createElement(ProtectedLayout),
    children: [
      {
        path: '/b2c/dashboard',
        element: React.createElement(ProtectedRouteWithMode, {
          requiredMode: 'b2c',
          children: React.createElement(UserDashboard, { user: { id: '1', email: 'user@example.com', role: 'b2c' } }),
        }),
      },
      {
        path: '/b2c/settings',
        element: React.createElement(ProtectedRouteWithMode, {
          requiredMode: 'b2c',
          children: React.createElement(UserSettings),
        }),
      },
       {
        path: '/b2c/scan',
        element: React.createElement(ProtectedRouteWithMode, {
          requiredMode: 'b2c',
          children: React.createElement(ScanPage),
        }),
      },
      {
        path: '/b2c/vr',
        element: React.createElement(ProtectedRouteWithMode, {
          requiredMode: 'b2c',
          children: React.createElement(VrPage),
        }),
      },
    ],
  },
];
