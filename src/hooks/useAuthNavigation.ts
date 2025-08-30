
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  const navigateAfterLogin = () => {
    console.log('Navigation après login - Role:', role, 'User:', user?.id);
    
    // Wait for role to be loaded
    if (loading) {
      console.log('Chargement en cours...');
      return;
    }
    
    if (role) {
      const dashboardRoute = getDashboardRoute(role);
      console.log('Redirection vers:', dashboardRoute);
      navigate(dashboardRoute, { replace: true });
    } else if (user) {
      // Fallback if role is not yet loaded
      console.log('Redirection fallback vers /app');
      navigate('/app', { replace: true });
    } else {
      console.log('Pas d\'utilisateur, redirection vers /');
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
