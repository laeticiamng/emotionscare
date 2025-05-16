
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SettingsPage from './pages/settings/SettingsPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';

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
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export default router;
