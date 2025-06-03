import * as React from 'react';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy loading des composants B2B Admin
const B2BAdminUsers = React.lazy(() => import('@/pages/b2b/admin/Users'));
const B2BAdminTeams = React.lazy(() => import('@/pages/b2b/admin/Teams'));
const B2BAdminReports = React.lazy(() => import('@/pages/b2b/admin/Reports'));
const B2BAdminEvents = React.lazy(() => import('@/pages/b2b/admin/Events'));
const B2BAdminAnalytics = React.lazy(() => import('@/pages/b2b/admin/analytics/AnalyticsPage'));
const B2BAdminJournal = React.lazy(() => import('@/pages/b2b/admin/Journal'));
const B2BAdminScan = React.lazy(() => import('@/pages/b2b/admin/Scan'));
const B2BAdminMusic = React.lazy(() => import('@/pages/b2b/admin/Music'));
const B2BAdminSettings = React.lazy(() => import('@/pages/b2b/admin/Settings'));
const B2BAdminOptimisation = React.lazy(() => import('@/pages/b2b/admin/Optimisation'));
const B2BAdminResources = React.lazy(() => import('@/pages/b2b/admin/ResourcesPage'));
const B2BAdminExtensions = React.lazy(() => import('@/pages/b2b/admin/ExtensionsPage'));

const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Component {...props} />
    </React.Suspense>
  );
};

export const b2bAdminRoutes = [
  {
    path: '/b2b/admin/users',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminUsers)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/teams',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminTeams)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/reports',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminReports)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/events',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminEvents)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/analytics',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminAnalytics)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/journal',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminJournal)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/scan',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminScan)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/music',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminMusic)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/settings',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminSettings)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/optimisation',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminOptimisation)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/resources',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminResources)()}
      </ProtectedRoute>
    ),
  },
  {
    path: '/b2b/admin/extensions',
    element: (
      <ProtectedRoute requiredRole="b2b_admin">
        {withSuspense(B2BAdminExtensions)()}
      </ProtectedRoute>
    ),
  },
];