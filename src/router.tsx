
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SettingsPage from './pages/settings/SettingsPage';
import AppLayout from './layouts/AppLayout';
import B2CLogin from './pages/b2c/Login';
import B2BUserLogin from './pages/b2b/user/Login';
import B2BAdminLogin from './pages/b2b/admin/Login';
import B2BUserRegister from './pages/b2b/user/Register';
import B2BSelection from './pages/b2b/Selection';
import LoginCommon from './pages/common/LoginPage';
import BusinessPage from './pages/BusinessPage';
import Dashboard from './pages/Dashboard';
import B2CDashboard from './pages/b2c/Dashboard';
import B2BUserDashboard from './pages/b2b/user/Dashboard';
import B2BAdminDashboard from './pages/b2b/admin/Dashboard';

// Create and export the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'login',
        element: <LoginCommon />
      },
      {
        path: 'auth/login',
        element: <LoginPage />
      },
      {
        path: 'auth/register',
        element: <RegisterPage />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'settings',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <SettingsPage />
          }
        ]
      },
      {
        path: 'b2c/login',
        element: <B2CLogin />
      },
      {
        path: 'b2c/dashboard',
        element: <B2CDashboard />
      },
      {
        path: 'b2b/user/login',
        element: <B2BUserLogin />
      },
      {
        path: 'b2b/user/dashboard',
        element: <B2BUserDashboard />
      },
      {
        path: 'b2b/admin/login',
        element: <B2BAdminLogin />
      },
      {
        path: 'b2b/admin/dashboard',
        element: <B2BAdminDashboard />
      },
      {
        path: 'b2b/user/register',
        element: <B2BUserRegister />
      },
      {
        path: 'b2b/selection',
        element: <B2BSelection />
      },
      {
        path: 'business',
        element: <BusinessPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export default router;
