import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load components
const ImmersiveHome = lazy(() => import('@/pages/ImmersiveHome'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const DashboardRedirect = lazy(() => import('@/pages/DashboardRedirect'));

// B2C Pages
const B2CLoginPage = lazy(() => import('@/pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/auth/B2CRegisterPage'));
const B2CResetPasswordPage = lazy(() => import('@/pages/b2c/auth/B2CResetPasswordPage'));
const B2COnboardingPage = lazy(() => import('@/pages/b2c/onboarding/B2COnboardingPage'));
const B2CDashboardPage = lazy(() => import('@/pages/b2c/dashboard/B2CDashboardPage'));
const B2CSocialPage = lazy(() => import('@/pages/b2c/social/B2CSocialPage'));

// B2B Common Pages
const B2BSelectionPage = lazy(() => import('@/pages/auth/B2BSelectionPage'));

// B2B User Pages
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/register/B2BUserRegisterPage'));
const B2BUserDashboardPage = lazy(() => import('@/pages/b2b/user/dashboard/B2BUserDashboardPage'));

// B2B Admin Pages
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/auth/B2BAdminLoginPage'));
const B2BAdminDashboardPage = lazy(() => import('@/pages/b2b/admin/dashboard/B2BAdminDashboardPage'));

// Other Pages
const Social = lazy(() => import('@/pages/Social'));
const HelpPage = lazy(() => import('@/pages/common/HelpPage'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ImmersiveHome />,
      },
      {
        path: 'choose-mode',
        element: <ChooseModePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardRedirect />,
      },
      {
        path: 'social',
        element: <Social />,
      },
      {
        path: 'help',
        element: <HelpPage />,
      },

      // B2C Routes
      {
        path: 'b2c',
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
                <B2CDashboardPage />
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
        ],
      },

      // B2B Routes
      {
        path: 'b2b',
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
                    <B2BUserDashboardPage />
                  </ProtectedRoute>
                ),
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
                    <B2BAdminDashboardPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  // Catch all route
  {
    path: '*',
    element: <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-4">Page non trouvée</p>
        <a href="/" className="text-primary hover:underline">Retour à l'accueil</a>
      </div>
    </div>,
  },
];

export default routes;
