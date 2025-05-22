
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy-loaded components
const DashboardRedirect = lazy(() => import('../pages/DashboardRedirect'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const B2CLayout = lazy(() => import('../layouts/B2CLayout'));
const TimelinePage = lazy(() => import('../pages/TimelinePage'));
const WorldPage = lazy(() => import('../pages/WorldPage'));
const SanctuaryPage = lazy(() => import('../pages/SanctuaryPage'));
const HomePage = lazy(() => import('../pages/Home'));
const ImmersiveHome = lazy(() => import('../pages/ImmersiveHome'));
const B2CDashboardPage = lazy(() => import('../pages/b2c/DashboardPage'));
const BusinessPage = lazy(() => import('../pages/BusinessPage'));
const B2BSelection = lazy(() => import('../pages/common/B2BSelection'));
const CollaboratorLoginPage = lazy(() => import('../pages/b2b/user/Login'));
const CollaboratorRegisterPage = lazy(() => import('../pages/b2b/user/Register'));
const AdminLoginPage = lazy(() => import('../pages/b2b/admin/Login'));
const ChooseMode = lazy(() => import('../pages/common/ChooseMode'));
const JournalPage = lazy(() => import('../pages/JournalPage'));
const MusicPage = lazy(() => import('../pages/MusicPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const B2BUserDashboard = lazy(() => import('../pages/b2b/user/Dashboard'));
const B2BAdminDashboard = lazy(() => import('../pages/b2b/admin/Dashboard'));
const ModeSwitcher = lazy(() => import('../pages/common/ModeSwitcher'));
const LoginRedirect = lazy(() => import('../components/common/LoginRedirect'));

// Define routes
const routes: RouteObject[] = [
  // Main landing page routes
  {
    path: '/',
    element: <ImmersiveHome />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/business',
    element: <BusinessPage />
  },
  
  // Mode selection routes
  {
    path: '/choose-mode',
    element: <ChooseMode />
  },
  {
    path: '/mode-switcher',
    element: <ModeSwitcher />
  },
  {
    path: '/b2b/selection',
    element: <B2BSelection />
  },
  
  // B2C routes
  {
    path: '/b2c',
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'dashboard',
        element: <B2CDashboardPage />
      }
    ]
  },
  
  // B2B User routes
  {
    path: '/login-collaborateur',
    element: <CollaboratorLoginPage />
  },
  {
    path: '/b2b/user/register',
    element: <CollaboratorRegisterPage />
  },
  {
    path: '/b2b/user/dashboard',
    element: <B2BUserDashboard />
  },
  
  // B2B Admin routes
  {
    path: '/login-admin',
    element: <AdminLoginPage />
  },
  {
    path: '/b2b/admin/dashboard',
    element: <B2BAdminDashboard />
  },
  
  // Common feature pages
  {
    path: '/timeline',
    element: <TimelinePage />
  },
  {
    path: '/world',
    element: <WorldPage />
  },
  {
    path: '/sanctuary',
    element: <SanctuaryPage />
  },
  {
    path: '/journal',
    element: <JournalPage />
  },
  {
    path: '/music',
    element: <MusicPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  
  // Dashboard redirect (will direct to the appropriate dashboard based on role)
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  
  // Fallback login redirect
  {
    path: '/login',
    element: <LoginRedirect />
  }
];

export default routes;
export { routes };
