
import { RouteObject, Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import LandingPage from '@/pages/LandingPage';
import B2BSelectionPage from '@/pages/B2BSelectionPage';
import B2CLayout from '@/layouts/B2CLayout';
import B2BUserLayout from '@/layouts/B2BUserLayout';
import B2BAdminLayout from '@/layouts/B2BAdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import B2CDashboardPage from '@/pages/b2c/DashboardPage';
import B2BUserDashboardPage from '@/pages/b2b/user/Dashboard';
import B2BAdminDashboardPage from '@/pages/b2b/admin/Dashboard';
import B2CGamificationPage from '@/pages/b2c/Gamification';
import B2BUserGamificationPage from '@/pages/b2b/user/Gamification';
import ImmersiveHome from '@/pages/ImmersiveHome';
import Home from '@/pages/Home';
import { env } from '../env.mjs';

// Fonction pour créer un wrapper conditionnel basé sur les paramètres d'environnement
const conditionalProtectedRoute = (requiredRole, children) => {
  // En mode développement ou si SKIP_AUTH_CHECK est activé, on désactive la protection
  if (env.SKIP_AUTH_CHECK) {
    return children;
  }
  
  // Sinon on applique la protection normalement
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      {children}
    </ProtectedRoute>
  );
};

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
  // Dashboard direct access route for development
  {
    path: 'dashboard',
    element: <Navigate to="/b2c/dashboard" replace />
  },
  // B2C Protected Routes
  {
    path: 'b2c',
    element: conditionalProtectedRoute("b2c", <B2CLayout />),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
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
    element: conditionalProtectedRoute("b2b_user", <B2BUserLayout />),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
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
    element: conditionalProtectedRoute("b2b_admin", <B2BAdminLayout />),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
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
