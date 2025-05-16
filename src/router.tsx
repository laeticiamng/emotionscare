
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import B2CLogin from './pages/b2c/Login';
import B2BUserLogin from './pages/b2b/user/Login';
import B2BAdminLogin from './pages/b2b/admin/Login';
import B2BUserRegister from './pages/b2b/user/Register';
import B2BSelection from './pages/b2b/Selection';
import LoginPage from './pages/common/LoginPage';

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
        path: 'b2c/login',
        element: <B2CLogin />
      },
      {
        path: 'b2b/user/login',
        element: <B2BUserLogin />
      },
      {
        path: 'b2b/admin/login',
        element: <B2BAdminLogin />
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
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export default router;
