
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ImmersiveHome from './pages/ImmersiveHome';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/common/Login';
import RegisterPage from './pages/common/Register';
import SettingsPage from './pages/settings/SettingsPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import B2BSelectionPage from './pages/B2BSelectionPage';
import B2CLayout from './layouts/B2CLayout';
import B2BUserLayout from './layouts/B2BUserLayout';
import B2BAdminLayout from './layouts/B2BAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Create and export the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ImmersiveHome />
      },
      {
        path: 'login',
        element: <LoginPage />
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
        path: 'b2c/login',
        element: <LoginPage />
      },
      {
        path: 'b2c/register',
        element: <RegisterPage />
      },
      {
        path: 'b2b/selection',
        element: <B2BSelectionPage />
      },
      {
        path: 'b2b/user/login',
        element: <LoginPage />
      },
      {
        path: 'b2b/admin/login',
        element: <LoginPage />
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
      // B2C Protected Routes
      {
        path: 'b2c',
        element: (
          <ProtectedRoute>
            <B2CLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          }
        ]
      },
      // B2B User Protected Routes
      {
        path: 'b2b/user',
        element: (
          <ProtectedRoute>
            <B2BUserLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          }
        ]
      },
      // B2B Admin Protected Routes
      {
        path: 'b2b/admin',
        element: (
          <ProtectedRoute>
            <B2BAdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          }
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export default router;
