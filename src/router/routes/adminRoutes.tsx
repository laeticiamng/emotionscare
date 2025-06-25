
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants admin
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const SystemAudit = lazy(() => import('@/pages/admin/SystemAudit'));
const OfficialRoutes = lazy(() => import('@/pages/admin/OfficialRoutes'));
const TeamsManagement = lazy(() => import('@/pages/admin/TeamsManagement'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const EventsManagement = lazy(() => import('@/pages/admin/EventsManagement'));
const Optimisation = lazy(() => import('@/pages/admin/Optimisation'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const Security = lazy(() => import('@/pages/admin/Security'));
const Accessibility = lazy(() => import('@/pages/admin/Accessibility'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="b2b_admin" />,
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: 'system-audit',
        element: <SystemAudit />
      },
      {
        path: 'official-routes',
        element: <OfficialRoutes />
      },
      {
        path: 'teams',
        element: <TeamsManagement />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'events',
        element: <EventsManagement />
      },
      {
        path: 'optimisation',
        element: <Optimisation />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'security',
        element: <Security />
      },
      {
        path: 'accessibility',
        element: <Accessibility />
      }
    ]
  },
  // Routes individuelles pour l'accès direct
  {
    path: '/audit',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <SystemAudit />
      </ProtectedRoute>
    )
  },
  {
    path: '/official-routes-audit',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        <OfficialRoutes />
      </ProtectedRoute>
    )
  }
];
