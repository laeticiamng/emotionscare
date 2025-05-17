import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ImmersiveHome from './pages/ImmersiveHome';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/common/Login';
import RegisterPage from './pages/common/Register';
import B2BSelectionPage from './pages/B2BSelectionPage';
import B2CLayout from './layouts/B2CLayout';
import B2BUserLayout from './layouts/B2BUserLayout';
import B2BAdminLayout from './layouts/B2BAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// B2C pages (needed for proper routing)
import B2CDashboard from './pages/b2c/Dashboard'; 

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
            path: 'dashboard',
            element: <B2CDashboard />
          }
          // Other B2C routes will be rendered by the router/index.tsx
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
            element: <B2CDashboard />
          }
          // Other B2B user routes will be rendered by the router/index.tsx
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
            element: <B2CDashboard />
          }
          // Other B2B admin routes will be rendered by the router/index.tsx
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
