
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  const navigateAfterLogin = () => {
    console.log('Navigation après login - Role:', role, 'User:', user?.id, 'Loading:', loading);
    
    if (loading) {
      console.log('Chargement en cours, attente...');
      setTimeout(() => navigateAfterLogin(), 500);
      return;
    }
    
    if (role) {
      let dashboardRoute = '/app/home'; // default
      
      switch (role) {
        case 'consumer':
          dashboardRoute = '/app/home';
          break;
        case 'employee':
          dashboardRoute = '/app/collab';
          break;
        case 'manager':
          dashboardRoute = '/app/rh';
          break;
        default:
          dashboardRoute = '/app/home';
      }
      
      console.log('Navigating to:', dashboardRoute);
      navigate(dashboardRoute, { replace: true });
      
    } else if (user) {
      console.log('User found but no role yet, retrying...');
      setTimeout(() => navigateAfterLogin(), 200);
    } else {
      console.log('No user, redirect to /');
      navigate('/', { replace: true });
    }
  };

  const navigateAfterLogout = () => {
    navigate('/', { replace: true });
  };

  return {
    navigateAfterLogin,
    navigateAfterLogout,
  };
};
