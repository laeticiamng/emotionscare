import { RouteObject } from 'react-router-dom';
import React from 'react';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';
import ProtectedLayout from '@/components/ProtectedLayout';
import UserSettings from '@/components/settings/UserSettings';
import UserDashboard from '@/components/dashboard/UserDashboard';

const B2BUserDashboard = React.lazy(() => import('@/pages/b2b/user/Dashboard'));
const B2BAdminDashboard = React.lazy(() => import('@/pages/b2b/admin/Dashboard'));
const B2BUserProfile = React.lazy(() => import('@/pages/b2b/user/Profile'));
const B2BAdminProfile = React.lazy(() => import('@/pages/b2b/admin/Profile'));
const B2BUserSettings = React.lazy(() => import('@/pages/b2b/user/Settings'));
const B2BAdminSettings = React.lazy(() => import('@/pages/b2b/admin/Settings'));
const B2BUserAnalytics = React.lazy(() => import('@/pages/b2b/user/Analytics'));
const B2BAdminAnalytics = React.lazy(() => import('@/pages/b2b/admin/Analytics'));
const B2BUserTeam = React.lazy(() => import('@/pages/b2b/user/Team'));
const B2BAdminTeam = React.lazy(() => import('@/pages/b2b/admin/Team'));

export const b2bRoutes: RouteObject[] = [
  // B2B User Routes
  {
    path: '/b2b/user',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_user">
        <ProtectedLayout />
      </ProtectedRouteWithMode>
    ),
    children: [
      {
        path: 'dashboard',
        element: <B2BUserDashboard />
      },
      {
        path: 'profile',
        element: <B2BUserProfile />
      },
      {
        path: 'settings',
        element: <B2BUserSettings />
      },
      {
        path: 'analytics',
        element: <B2BUserAnalytics />
      },
      {
        path: 'team',
        element: <B2BUserTeam />
      }
    ]
  },
  
  // B2B Admin Routes
  {
    path: '/b2b/admin',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_admin">
        <ProtectedLayout />
      </ProtectedRouteWithMode>
    ),
    children: [
      {
        path: 'dashboard',
        element: <B2BAdminDashboard />
      },
      {
        path: 'profile',
        element: <B2BAdminProfile />
      },
      {
        path: 'settings',
        element: <B2BAdminSettings />
      },
      {
        path: 'analytics',
        element: <B2BAdminAnalytics />
      },
      {
        path: 'team',
        element: <B2BAdminTeam />
      }
    ]
  }
];
