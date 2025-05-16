
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ImmersiveHome from './pages/ImmersiveHome';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

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
        path: 'home',
        element: <Home />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'immersive',
        element: <ImmersiveHome />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export default router;
