
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserMode } from '@/types/auth';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();

  const navigateToLogin = useCallback((mode?: UserMode) => {
    const targetMode = mode || userMode;
    switch (targetMode) {
      case 'b2c':
        navigate('/b2c/login');
        break;
      case 'b2b_user':
        navigate('/b2b/user/login');
        break;
      case 'b2b_admin':
        navigate('/b2b/admin/login');
        break;
      default:
        navigate('/choose-mode');
    }
  }, [navigate, userMode]);

  const navigateToDashboard = useCallback((mode?: UserMode) => {
    const targetMode = mode || userMode || user?.role;
    switch (targetMode) {
      case 'b2c':
        navigate('/b2c/dashboard');
        break;
      case 'b2b_user':
        navigate('/b2b/user/dashboard');
        break;
      case 'b2b_admin':
        navigate('/b2b/admin/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  }, [navigate, userMode, user]);

  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const isCurrentRoute = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const isRouteActive = useCallback((path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return {
    navigate,
    location,
    navigateToLogin,
    navigateToDashboard,
    navigateToHome,
    isCurrentRoute,
    isRouteActive,
    isAuthenticated,
    userMode,
  };
};
