
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import Shell from '@/Shell';
import ProtectedLayout from '@/components/ProtectedLayout';
import ProtectedRouteWithMode from '@/components/ProtectedRouteWithMode';

// Lazy load all pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/auth/B2BSelectionPage'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));
const DashboardRedirect = lazy(() => import('@/pages/DashboardRedirect'));

// B2C Pages
const B2CLoginPage = lazy(() => import('@/pages/b2c/auth/B2CLoginPage'));
const B2CRegisterPage = lazy(() => import('@/pages/b2c/auth/B2CRegisterPage'));
const B2CResetPassword = lazy(() => import('@/pages/b2c/ResetPassword'));
const B2CDashboard = lazy(() => import('@/pages/dashboards/B2CDashboard'));
const B2COnboarding = lazy(() => import('@/pages/b2c/OnboardingPage'));
const B2CJournal = lazy(() => import('@/pages/b2c/Journal'));
const B2CMusic = lazy(() => import('@/pages/b2c/MusicPage'));
const B2CScan = lazy(() => import('@/pages/b2c/ScanPage'));
const B2CCoach = lazy(() => import('@/pages/b2c/CoachPage'));
const B2CVR = lazy(() => import('@/pages/b2c/VRPage'));
const B2CSocial = lazy(() => import('@/pages/b2c/SocialPage'));
const B2CSettings = lazy(() => import('@/pages/b2c/SettingsPage'));

// B2B User Pages
const B2BUserLoginPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserLoginPage'));
const B2BUserRegisterPage = lazy(() => import('@/pages/b2b/user/auth/B2BUserRegisterPage'));
const B2BUserDashboard = lazy(() => import('@/pages/dashboards/B2BUserDashboard'));

// B2B Admin Pages
const B2BAdminLoginPage = lazy(() => import('@/pages/b2b/admin/auth/B2BAdminLoginPage'));
const B2BAdminDashboard = lazy(() => import('@/pages/dashboards/B2BAdminDashboard'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Shell />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'choose-mode',
        element: <ChooseModePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardRedirect />,
      },
      
      // B2C Routes
      {
        path: 'b2c/login',
        element: <B2CLoginPage />,
      },
      {
        path: 'b2c/register',
        element: <B2CRegisterPage />,
      },
      {
        path: 'b2c/reset-password',
        element: <B2CResetPassword />,
      },
      
      // B2B Selection
      {
        path: 'b2b/selection',
        element: <B2BSelectionPage />,
      },
      
      // B2B User Routes
      {
        path: 'b2b/user/login',
        element: <B2BUserLoginPage />,
      },
      {
        path: 'b2b/user/register',
        element: <B2BUserRegisterPage />,
      },
      
      // B2B Admin Routes
      {
        path: 'b2b/admin/login',
        element: <B2BAdminLoginPage />,
      },
      
      // Protected Routes
      {
        path: '',
        element: <ProtectedLayout />,
        children: [
          // B2C Protected Routes
          {
            path: 'b2c/onboarding',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2COnboarding />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/dashboard',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CDashboard />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/journal',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CJournal />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/music',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CMusic />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/scan',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CScan />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/coach',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CCoach />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/vr',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CVR />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/social',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CSocial />
              </ProtectedRouteWithMode>
            ),
          },
          {
            path: 'b2c/settings',
            element: (
              <ProtectedRouteWithMode requiredMode="b2c">
                <B2CSettings />
              </ProtectedRouteWithMode>
            ),
          },
          
          // B2B User Protected Routes
          {
            path: 'b2b/user/dashboard',
            element: (
              <ProtectedRouteWithMode requiredMode="b2b_user">
                <B2BUserDashboard />
              </ProtectedRouteWithMode>
            ),
          },
          
          // B2B Admin Protected Routes
          {
            path: 'b2b/admin/dashboard',
            element: (
              <ProtectedRouteWithMode requiredMode="b2b_admin">
                <B2BAdminDashboard />
              </ProtectedRouteWithMode>
            ),
          },
        ],
      },
      
      // Catch all for 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;
