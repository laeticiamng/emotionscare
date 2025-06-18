
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Shell from '@/Shell';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const AuditPage = lazy(() => import('@/pages/AuditPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

// Auth pages
const B2CLoginPage = lazy(() => import('@/pages/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/auth/B2CRegisterPage'));
const B2BUserLoginPage = lazy(() => import('@/pages/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/auth/B2BUserRegisterPage'));
const B2BAdminLoginPage = lazy(() => import('@/pages/auth/B2BAdminLoginPage'));
const B2BSelectionPage = lazy(() => import('@/pages/auth/B2BSelectionPage'));

// Dashboard pages
const B2CDashboard = lazy(() => import('@/pages/b2c/B2CDashboard'));
const B2BUserDashboard = lazy(() => import('@/pages/b2b/user/B2BUserDashboard'));
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/admin/B2BAdminDashboard'));

// Wrapper avec Suspense
const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <Component {...props} />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage)(),
      },
      {
        path: 'choose-mode',
        element: withSuspense(ChooseModePage)(),
      },
      {
        path: 'audit',
        element: withSuspense(AuditPage)(),
      },
      {
        path: 'dashboard',
        element: withSuspense(DashboardPage)(),
      },
      // Routes B2C
      {
        path: 'b2c',
        children: [
          {
            path: 'login',
            element: withSuspense(B2CLoginPage)(),
          },
          {
            path: 'register',
            element: withSuspense(B2CRegisterPage)(),
          },
          {
            path: 'dashboard',
            element: withSuspense(B2CDashboard)(),
          },
        ],
      },
      // Routes B2B
      {
        path: 'b2b',
        children: [
          {
            path: 'selection',
            element: withSuspense(B2BSelectionPage)(),
          },
          {
            path: 'user',
            children: [
              {
                path: 'login',
                element: withSuspense(B2BUserLoginPage)(),
              },
              {
                path: 'register',
                element: withSuspense(B2BUserRegisterPage)(),
              },
              {
                path: 'dashboard',
                element: withSuspense(B2BUserDashboard)(),
              },
            ],
          },
          {
            path: 'admin',
            children: [
              {
                path: 'login',
                element: withSuspense(B2BAdminLoginPage)(),
              },
              {
                path: 'dashboard',
                element: withSuspense(B2BAdminDashboard)(),
              },
            ],
          },
        ],
      },
      // Redirect pour les routes non trouvées
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
