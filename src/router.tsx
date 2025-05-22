
import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Shell from './Shell';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteWithMode from './components/ProtectedRouteWithMode';

// Pages à chargement différé pour optimiser le temps de chargement
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Journal = lazy(() => import('./pages/Journal'));
const Music = lazy(() => import('./pages/Music'));
const Audio = lazy(() => import('./pages/Audio'));
const Login = lazy(() => import('./pages/common/Login'));
const Register = lazy(() => import('./pages/common/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));
const B2BSelection = lazy(() => import('./pages/b2b/Selection'));
const Pricing = lazy(() => import('./pages/Pricing'));
const DashboardRedirect = lazy(() => import('./pages/DashboardRedirect'));
const ModeSwitcher = lazy(() => import('./pages/common/ModeSwitcher'));

// B2C Pages
const B2CDashboard = lazy(() => import('./pages/b2c/Dashboard'));
const B2CJournal = lazy(() => import('./pages/b2c/Journal'));
const B2CMusic = lazy(() => import('./pages/b2c/Music'));
const B2CAudio = lazy(() => import('./pages/b2c/Audio'));
const B2COnboarding = lazy(() => import('./pages/b2c/Onboarding'));

// B2B User Pages
const B2BUserDashboard = lazy(() => import('./pages/b2b/user/Dashboard'));
const B2BUserJournal = lazy(() => import('./pages/b2b/user/Journal'));
const B2BUserMusic = lazy(() => import('./pages/b2b/user/Music'));
const B2BUserAudio = lazy(() => import('./pages/b2b/user/Audio'));

// B2B Admin Pages
const B2BAdminDashboard = lazy(() => import('./pages/b2b/admin/Dashboard'));
const B2BAdminUsers = lazy(() => import('./pages/b2b/admin/Users'));
const B2BAdminReports = lazy(() => import('./pages/b2b/admin/Reports'));

const routes: RouteObject[] = [
  // Landing page
  {
    path: '/',
    element: <LandingPage />,
    index: true,
  },
  
  // Pricing page
  {
    path: '/pricing',
    element: <Pricing />,
  },
  
  // B2C Routes
  {
    path: 'b2c',
    element: <ProtectedRoute requiredRole="b2c" />,
    children: [
      {
        path: '',
        element: <Navigate to="/b2c/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Shell><B2CDashboard /></Shell>,
      },
      {
        path: 'journal',
        element: <Shell><B2CJournal /></Shell>,
      },
      {
        path: 'music',
        element: <Shell><B2CMusic /></Shell>,
      },
      {
        path: 'audio',
        element: <Shell><B2CAudio /></Shell>,
      },
      {
        path: 'onboarding',
        element: <Shell><B2COnboarding /></Shell>,
      },
    ],
  },
  
  // B2C Auth Routes (not protected)
  {
    path: 'b2c/login',
    element: <Login mode="b2c" />,
  },
  {
    path: 'b2c/register',
    element: <Register mode="b2c" />,
  },
  
  // B2B User Routes
  {
    path: 'b2b/user',
    element: <ProtectedRoute requiredRole="b2b_user" />,
    children: [
      {
        path: '',
        element: <Navigate to="/b2b/user/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Shell><B2BUserDashboard /></Shell>,
      },
      {
        path: 'journal',
        element: <Shell><B2BUserJournal /></Shell>,
      },
      {
        path: 'music',
        element: <Shell><B2BUserMusic /></Shell>,
      },
      {
        path: 'audio',
        element: <Shell><B2BUserAudio /></Shell>,
      },
    ],
  },
  
  // B2B User Auth Routes (not protected)
  {
    path: 'b2b/user/login',
    element: <Login mode="b2b_user" />,
  },
  {
    path: 'b2b/user/register',
    element: <Register mode="b2b_user" />,
  },
  
  // B2B Admin Routes
  {
    path: 'b2b/admin',
    element: <ProtectedRoute requiredRole="b2b_admin" />,
    children: [
      {
        path: '',
        element: <Navigate to="/b2b/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Shell><B2BAdminDashboard /></Shell>,
      },
      {
        path: 'users',
        element: <Shell><B2BAdminUsers /></Shell>,
      },
      {
        path: 'reports',
        element: <Shell><B2BAdminReports /></Shell>,
      },
    ],
  },
  
  // B2B Admin Auth Routes (not protected)
  {
    path: 'b2b/admin/login',
    element: <Login mode="b2b_admin" />,
  },
  
  // B2B Role Selection
  {
    path: 'b2b/selection',
    element: <B2BSelection />,
  },
  
  // User Mode Selection
  {
    path: 'choose-mode',
    element: <ModeSwitcher />,
  },
  
  // Generic Dashboard redirect
  {
    path: 'dashboard',
    element: <DashboardRedirect />,
  },
  
  // Legacy routes - redirections
  {
    path: '/login-collaborateur',
    element: <Navigate to="/b2b/user/login" replace />,
  },
  {
    path: '/login-admin',
    element: <Navigate to="/b2b/admin/login" replace />,
  },
  {
    path: '/login',
    element: <Navigate to="/b2c/login" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/b2c/register" replace />,
  },
  
  // Catch-all route for 404
  {
    path: '404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default routes;
