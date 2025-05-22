
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath, normalizeUserMode } from '@/utils/userModeHelpers';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle authentication redirects
  useEffect(() => {
    if (authLoading || userModeLoading) return;

    const currentPath = location.pathname;
    
    // Define login/register paths
    const authPaths = [
      '/login', '/register', 
      '/b2c/login', '/b2c/register',
      '/b2b/user/login', '/b2b/user/register',
      '/b2b/admin/login'
    ];
    
    // If user is authenticated and on a login/register page, redirect to dashboard
    if (isAuthenticated && authPaths.some(path => currentPath === path)) {
      // Determine which dashboard to go to based on userMode
      const dashboardPath = getModeDashboardPath(normalizeUserMode(userMode));
      navigate(dashboardPath);
    }

  }, [isAuthenticated, authLoading, userModeLoading, navigate, location.pathname, user, userMode]);

  return <>{children}</>;
};

export default AuthTransition;
