
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const navigateAfterLogin = () => {
    if (role) {
      const dashboardRoute = getDashboardRoute(role);
      navigate(dashboardRoute);
    } else if (user) {
      // Fallback if role is not yet loaded
      navigate('/app');
    } else {
      navigate('/');
    }
  };

  const navigateAfterLogout = () => {
    navigate('/');
  };

  return {
    navigateAfterLogin,
    navigateAfterLogout,
  };
};
