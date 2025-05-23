
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';
import AppRouter from './AppRouter';

// Layouts
import B2CLayout from '@/layouts/B2CLayout';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';
import ProtectedLayout from '@/components/ProtectedLayout';

// Common pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ChooseMode = lazy(() => import('@/pages/common/ChooseMode'));
const B2BSelection = lazy(() => import('@/pages/b2b/Selection'));
const Unauthorized = lazy(() => import('@/pages/common/Unauthorized'));
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/error/ForbiddenPage'));
const ServerErrorPage = lazy(() => import('@/pages/errors/ServerErrorPage'));

// B2C pages
const B2CLogin = lazy(() => import('@/pages/b2c/Login'));
const B2CRegister = lazy(() => import('@/pages/b2c/Register'));
const B2CResetPassword = lazy(() => import('@/pages/b2c/ResetPassword'));
const B2CDashboard = lazy(() => import('@/pages/dashboards/B2CDashboard'));
const B2COnboarding = lazy(() => import('@/pages/b2c/Onboarding'));
const B2CJournal = lazy(() => import('@/pages/b2c/Journal'));
const B2CMusic = lazy(() => import('@/pages/b2c/Music'));
const B2CScan = lazy(() => import('@/pages/ScanPage'));
const B2CVRS = lazy(() => import('@/pages/VRPage'));
const B2CSocial = lazy(() => import('@/pages/Social'));
const CoachChat = lazy(() => import('@/pages/b2c/CoachChat'));
const B2CGamification = lazy(() => import('@/pages/b2c/Gamification'));

// B2B User pages
const B2BUserLogin = lazy(() => import('@/pages/b2b/user/Login'));
const B2BUserRegister = lazy(() => import('@/pages/b2b/user/Register'));
const B2BUserDashboard = lazy(() => import('@/pages/dashboards/B2BUserDashboard'));

// B2B Admin pages
const B2BAdminLogin = lazy(() => import('@/pages/b2b/admin/Login'));
const B2BAdminDashboard = lazy(() => import('@/pages/dashboards/B2BAdminDashboard'));

// Settings
const UserSettings = lazy(() => import('@/components/settings/UserSettings'));

const LoadingPage = () => (
  <div className="flex h-screen items-center justify-center">
    <LoadingAnimation text="Chargement de la page..." />
  </div>
);

const routes = [
  // Public routes (no auth required)
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/choose-mode",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <ChooseMode />
      </Suspense>
    ),
  },
  {
    path: "/b2b/selection",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <B2BSelection />
      </Suspense>
    ),
  },

  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/b2c/login",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <B2CLogin />
          </Suspense>
        ),
      },
      {
        path: "/b2c/register",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <B2CRegister />
          </Suspense>
        ),
      },
      {
        path: "/b2c/reset-password",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <B2CResetPassword />
          </Suspense>
        ),
      },
      {
        path: "/b2b/user/login",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <B2BUserLogin />
          </Suspense>
        ),
      },
      {
        path: "/b2b/user/register",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <B2BUserRegister />
          </Suspense>
        ),
      },
      {
        path: "/b2b/admin/login",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <B2BAdminLogin />
          </Suspense>
        ),
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedLayout />,
    children: [
      // B2C routes
      {
        path: "/b2c",
        element: <B2CLayout />,
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CDashboard />
              </Suspense>
            ),
          },
          {
            path: "onboarding",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2COnboarding />
              </Suspense>
            ),
          },
          {
            path: "journal",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CJournal />
              </Suspense>
            ),
          },
          {
            path: "music",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CMusic />
              </Suspense>
            ),
          },
          {
            path: "scan",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CScan />
              </Suspense>
            ),
          },
          {
            path: "vr",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CVRS />
              </Suspense>
            ),
          },
          {
            path: "coach",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <CoachChat />
              </Suspense>
            ),
          },
          {
            path: "social",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CSocial />
              </Suspense>
            ),
          },
          {
            path: "gamification",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CGamification />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <UserSettings />
              </Suspense>
            ),
          },
          { 
            index: true, 
            element: <Navigate to="/b2c/dashboard" replace /> 
          },
        ],
      },

      // B2B User routes
      {
        path: "/b2b/user",
        element: <B2CLayout />,
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2BUserDashboard />
              </Suspense>
            ),
          },
          {
            path: "journal",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CJournal />
              </Suspense>
            ),
          },
          {
            path: "music",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CMusic />
              </Suspense>
            ),
          },
          {
            path: "scan",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CScan />
              </Suspense>
            ),
          },
          {
            path: "vr",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CVRS />
              </Suspense>
            ),
          },
          {
            path: "coach",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <CoachChat />
              </Suspense>
            ),
          },
          {
            path: "social",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2CSocial />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <UserSettings />
              </Suspense>
            ),
          },
          { 
            index: true, 
            element: <Navigate to="/b2b/user/dashboard" replace /> 
          },
        ],
      },

      // B2B Admin routes
      {
        path: "/b2b/admin",
        element: <B2BAdminLayout />,
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <B2BAdminDashboard />
              </Suspense>
            ),
          },
          { 
            index: true, 
            element: <Navigate to="/b2b/admin/dashboard" replace /> 
          },
        ],
      },
    ],
  },

  // Error pages
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "/forbidden",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <ForbiddenPage />
      </Suspense>
    ),
  },
  {
    path: "/server-error",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <ServerErrorPage />
      </Suspense>
    ),
  },
  
  // Fallback/404 route
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingPage />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

export default routes;
