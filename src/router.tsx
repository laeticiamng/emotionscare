
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Pages d'authentification et communes
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const ChooseModePage = React.lazy(() => import('./pages/ChooseModePage'));
const B2BSelectionPage = React.lazy(() => import('./pages/common/B2BSelection'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardRedirect = React.lazy(() => import('./pages/DashboardRedirect'));
const ProfilePage = React.lazy(() => import('./pages/common/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/common/SettingsPage'));
const BillingPage = React.lazy(() => import('./pages/common/BillingPage'));
const NotFoundPage = React.lazy(() => import('./pages/common/NotFoundPage'));

// Pages B2C
const B2CLoginPage = React.lazy(() => import('./pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = React.lazy(() => import('./pages/b2c/auth/B2CRegisterPage'));
const B2CResetPasswordPage = React.lazy(() => import('./pages/b2c/auth/B2CResetPasswordPage'));
const B2CDashboardPage = React.lazy(() => import('./pages/b2c/dashboard/B2CDashboardPage'));
const B2COnboardingPage = React.lazy(() => import('./pages/b2c/onboarding/B2COnboardingPage'));
const B2CSocialPage = React.lazy(() => import('./pages/b2c/social/B2CSocialPage'));
const B2CScanPage = React.lazy(() => import('./pages/b2c/scan/B2CScanPage'));

// Pages B2B User
const B2BUserLoginPage = React.lazy(() => import('./pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = React.lazy(() => import('./pages/b2b/user/auth/B2BUserRegisterPage'));
const B2BUserDashboardPage = React.lazy(() => import('./pages/b2b/user/dashboard/B2BUserDashboardPage'));
const B2BUserSocialPage = React.lazy(() => import('./pages/b2b/user/social/B2BUserSocialPage'));
const B2BUserScanPage = React.lazy(() => import('./pages/b2b/user/scan/B2BUserScanPage'));

// Pages B2B Admin
const B2BAdminLoginPage = React.lazy(() => import('./pages/b2b/admin/auth/B2BAdminLoginPage'));
const B2BAdminDashboardPage = React.lazy(() => import('./pages/b2b/admin/dashboard/B2BAdminDashboardPage'));
const B2BAdminSocialPage = React.lazy(() => import('./pages/b2b/admin/social/B2BAdminSocialPage'));
const B2BAdminUsersPage = React.lazy(() => import('./pages/b2b/admin/users/B2BAdminUsersPage'));
const B2BAdminTeamsPage = React.lazy(() => import('./pages/b2b/admin/teams/B2BAdminTeamsPage'));

// Layouts
const AppLayout = React.lazy(() => import('./layouts/AppLayout'));
const AuthLayout = React.lazy(() => import('./layouts/AuthLayout'));
const B2CLayout = React.lazy(() => import('./layouts/B2CLayout'));
const B2BAdminLayout = React.lazy(() => import('./layouts/B2BAdminLayout'));
const ProtectedLayout = React.lazy(() => import('./components/ProtectedLayout'));

// Components
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const ProtectedRouteWithMode = React.lazy(() => import('./components/ProtectedRouteWithMode'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardRedirect />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedLayout>
        <ProfilePage />
      </ProtectedLayout>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedLayout>
        <SettingsPage />
      </ProtectedLayout>
    ),
  },
  {
    path: '/billing',
    element: (
      <ProtectedLayout>
        <BillingPage />
      </ProtectedLayout>
    ),
  },
  
  // B2C Routes
  {
    path: '/b2c/login',
    element: (
      <AuthLayout>
        <B2CLoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/b2c/register',
    element: (
      <AuthLayout>
        <B2CRegisterPage />
      </AuthLayout>
    ),
  },
  {
    path: '/b2c/reset-password',
    element: (
      <AuthLayout>
        <B2CResetPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/b2c/onboarding',
    element: (
      <ProtectedRouteWithMode requiredMode="b2c">
        <B2COnboardingPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2c/dashboard',
    element: (
      <ProtectedRouteWithMode requiredMode="b2c">
        <B2CLayout>
          <B2CDashboardPage />
        </B2CLayout>
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2c/scan',
    element: (
      <ProtectedRouteWithMode requiredMode="b2c">
        <B2CLayout>
          <B2CScanPage />
        </B2CLayout>
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2c/social',
    element: (
      <ProtectedRouteWithMode requiredMode="b2c">
        <B2CLayout>
          <B2CSocialPage />
        </B2CLayout>
      </ProtectedRouteWithMode>
    ),
  },

  // B2B User Routes
  {
    path: '/b2b/user/login',
    element: (
      <AuthLayout>
        <B2BUserLoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/b2b/user/register',
    element: (
      <AuthLayout>
        <B2BUserRegisterPage />
      </AuthLayout>
    ),
  },
  {
    path: '/b2b/user/dashboard',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_user">
        <B2BUserDashboardPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/user/scan',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_user">
        <B2BUserScanPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/user/social',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_user">
        <B2BUserSocialPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/user/calendar',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_user">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p>Fonctionnalité bientôt disponible</p>
        </div>
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/user/chat',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_user">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Chat équipe</h1>
          <p>Fonctionnalité bientôt disponible</p>
        </div>
      </ProtectedRouteWithMode>
    ),
  },

  // B2B Admin Routes
  {
    path: '/b2b/admin/login',
    element: (
      <AuthLayout>
        <B2BAdminLoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/b2b/admin/dashboard',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_admin">
        <B2BAdminDashboardPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/admin/users',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_admin">
        <B2BAdminUsersPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/admin/teams',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_admin">
        <B2BAdminTeamsPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/admin/social-cocoon',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_admin">
        <B2BAdminSocialPage />
      </ProtectedRouteWithMode>
    ),
  },
  {
    path: '/b2b/admin/reports',
    element: (
      <ProtectedRouteWithMode requiredMode="b2b_admin">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p>Fonctionnalité bientôt disponible</p>
        </div>
      </ProtectedRouteWithMode>
    ),
  },

  // Auth routes
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },

  // 404 Page
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
