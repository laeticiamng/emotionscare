
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateAfterLogin = () => {
    if (user?.role) {
      const dashboardRoute = getDashboardRoute(user.role as 'b2c' | 'b2b_user' | 'b2b_admin');
      navigate(dashboardRoute);
    } else {
      navigate('/home');
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
