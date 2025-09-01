
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  const navigateAfterLogin = () => {
    console.log('Navigation après login - Role:', role, 'User:', user?.id, 'Loading:', loading);
    
    // If auth is still loading, wait and retry
    if (loading) {
      console.log('Chargement en cours, attente...');
      setTimeout(() => navigateAfterLogin(), 500);
      return;
    }
    
    if (role) {
      const dashboardRoute = getDashboardRoute(role);
      console.log('getDashboardRoute result:', dashboardRoute, 'for role:', role);
      console.log('Navigating to:', dashboardRoute);
      
      // Force navigation
      window.location.href = dashboardRoute;
      
    } else if (user) {
      // If user exists but no role yet, wait a bit for role to load
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
