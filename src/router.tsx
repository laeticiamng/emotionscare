
import { RouteObject } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/common/Login';
import RegisterPage from './pages/common/Register';
import B2BSelectionPage from './pages/B2BSelectionPage';
import B2CLayout from './layouts/B2CLayout';
import B2BUserLayout from './layouts/B2BUserLayout';
import B2BAdminLayout from './layouts/B2BAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import B2CDashboardPage from './pages/b2c/DashboardPage';
import B2BUserDashboardPage from './pages/b2b/user/Dashboard';
import B2BAdminDashboardPage from './pages/b2b/admin/Dashboard';
import B2CGamificationPage from './pages/b2c/Gamification';
import B2BUserGamificationPage from './pages/b2b/user/Gamification';
import ImmersiveHome from './pages/ImmersiveHome';
import Home from './pages/Home';

// Define the application routes without creating a router instance
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />
  },
  {
    path: '/home',
    element: <Home />
  },
  // B2C Auth Routes
  {
    path: 'b2c/login',
    element: <LoginPage />
  },
  {
    path: 'b2c/register',
    element: <RegisterPage />
  },
  // B2B Selection Route
  {
    path: 'b2b/selection',
    element: <B2BSelectionPage />
  },
  // Make sure the route with special character is also supported
  {
    path: 'b2b/sélection',
    element: <B2BSelectionPage />
  },
  // B2B Auth Routes
  {
    path: 'b2b/user/login',
    element: <LoginPage />
  },
  {
    path: 'b2b/admin/login',
    element: <LoginPage />
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
        path: '',
        element: <B2CDashboardPage /> // Default route when accessing /b2c
      },
      {
        path: 'dashboard',
        element: <B2CDashboardPage />
      },
      {
        path: 'gamification',
        element: <B2CGamificationPage />
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
        path: '',
        element: <B2BUserDashboardPage /> // Default route when accessing /b2b/user
      },
      {
        path: 'dashboard',
        element: <B2BUserDashboardPage />
      },
      {
        path: 'gamification',
        element: <B2BUserGamificationPage />
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
        path: '',
        element: <B2BAdminDashboardPage /> // Default route when accessing /b2b/admin
      },
      {
        path: 'dashboard',
        element: <B2BAdminDashboardPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
