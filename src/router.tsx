
import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import B2CLayout from '@/layouts/B2CLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Layouts
const AppLayout = lazy(() => import('@/layouts/AppLayout'));
const B2BAdminLayout = lazy(() => import('@/layouts/B2BAdminLayout'));

// Pages communes
const HomePage = lazy(() => import('@/pages/HomePage'));
const ChooseModePage = lazy(() => import('@/pages/ChooseModePage'));
const B2BSelectionPage = lazy(() => import('@/pages/auth/B2BSelectionPage'));
const DashboardRedirect = lazy(() => import('@/pages/DashboardRedirect'));

// Pages B2C
const B2CLogin = lazy(() => import('@/pages/b2c/Login'));
const B2CRegister = lazy(() => import('@/pages/b2c/Register'));
const B2CResetPassword = lazy(() => import('@/pages/b2c/ResetPassword'));
const B2CDashboard = lazy(() => import('@/pages/dashboards/B2CDashboard'));
const B2COnboarding = lazy(() => import('@/pages/b2c/Onboarding'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const VRPage = lazy(() => import('@/pages/VRPage'));
const JournalPage = lazy(() => import('@/pages/JournalPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const CoachPage = lazy(() => import('@/pages/CoachPage'));

// Pages B2B User
const B2BUserLogin = lazy(() => import('@/pages/b2b/user/Login'));
const B2BUserRegister = lazy(() => import('@/pages/b2b/user/Register'));
const B2BUserDashboard = lazy(() => import('@/pages/dashboards/B2BUserDashboard'));

// Pages B2B Admin
const B2BAdminLogin = lazy(() => import('@/pages/b2b/admin/Login'));
const B2BAdminDashboard = lazy(() => import('@/pages/dashboards/B2BAdminDashboard'));

// Pages sociales
const SocialPage = lazy(() => import('@/pages/Social'));

const routes: RouteObject[] = [
  // Routes publiques
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/choose-mode',
    element: <ChooseModePage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  
  // Redirections
  {
    path: '/dashboard',
    element: <DashboardRedirect />,
  },
  
  // Routes B2C
  {
    path: '/b2c',
    element: <ProtectedLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/b2c/dashboard" replace />
      },
      {
        path: 'login',
        element: <AuthLayout><B2CLogin /></AuthLayout>
      },
      {
        path: 'register',
        element: <AuthLayout><B2CRegister /></AuthLayout>
      },
      {
        path: 'reset-password',
        element: <AuthLayout><B2CResetPassword /></AuthLayout>
      },
      {
        path: 'dashboard',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <B2CDashboard />
          }
        ]
      },
      {
        path: 'onboarding',
        element: <B2COnboarding />
      },
      {
        path: 'scan',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <ScanPage />
          }
        ]
      },
      {
        path: 'vr',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <VRPage />
          }
        ]
      },
      {
        path: 'journal',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <JournalPage />
          }
        ]
      },
      {
        path: 'music',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <MusicPage />
          }
        ]
      },
      {
        path: 'coach',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <CoachPage />
          }
        ]
      },
      {
        path: 'social',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <SocialPage />
          }
        ]
      }
    ]
  },
  
  // Routes B2B User
  {
    path: '/b2b/user',
    element: <ProtectedLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/b2b/user/dashboard" replace />
      },
      {
        path: 'login',
        element: <AuthLayout><B2BUserLogin /></AuthLayout>
      },
      {
        path: 'register',
        element: <AuthLayout><B2BUserRegister /></AuthLayout>
      },
      {
        path: 'dashboard',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <B2BUserDashboard />
          }
        ]
      },
      {
        path: 'scan',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <ScanPage />
          }
        ]
      },
      {
        path: 'vr',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <VRPage />
          }
        ]
      },
      {
        path: 'journal',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <JournalPage />
          }
        ]
      },
      {
        path: 'music',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <MusicPage />
          }
        ]
      },
      {
        path: 'social',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <SocialPage />
          }
        ]
      },
      {
        path: 'cocon',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <CoachPage specialMode="cocon" />
          }
        ]
      },
      {
        path: 'team-challenges',
        element: <B2CLayout />,
        children: [
          {
            path: '',
            element: <SocialPage teamView={true} />
          }
        ]
      }
    ]
  },
  
  // Routes B2B Admin
  {
    path: '/b2b/admin',
    element: <ProtectedLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/b2b/admin/dashboard" replace />
      },
      {
        path: 'login',
        element: <AuthLayout><B2BAdminLogin /></AuthLayout>
      },
      {
        path: 'dashboard',
        element: <B2BAdminLayout />,
        children: [
          {
            path: '',
            element: <B2BAdminDashboard />
          }
        ]
      }
    ]
  },
  
  // Route 404
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes;
