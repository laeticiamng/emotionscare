
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const location = useLocation();

  // If authentication or userMode is loading, show a loading state
  if (authLoading || userModeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Define explicit protected paths that require authentication
  // Only redirect if user is not authenticated AND trying to access a protected route
  const isProtectedPath = location.pathname.includes('/b2c/') && 
                         !location.pathname.includes('/login') && 
                         !location.pathname.includes('/register') ||
                         location.pathname.includes('/b2b/user/') && 
                         !location.pathname.includes('/login') && 
                         !location.pathname.includes('/register') ||
                         location.pathname.includes('/b2b/admin/') && 
                         !location.pathname.includes('/login') && 
                         !location.pathname.includes('/register');

  if (!isAuthenticated && isProtectedPath) {
    // Determine which login page to redirect to based on the path
    let loginPath = '/b2c/login'; // default to B2C login
    
    if (location.pathname.includes('/b2b/admin')) {
      loginPath = '/b2b/admin/login';
    } else if (location.pathname.includes('/b2b/user')) {
      loginPath = '/b2b/user/login';
    }

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If user is authenticated but hasn't selected a mode yet (except when on the mode selection page)
  // Only redirect if actually needed - don't force redirect if they're already on a valid path
  if (isAuthenticated && !userMode && !location.pathname.includes('/choose-mode') && isProtectedPath) {
    return <Navigate to="/choose-mode" replace />;
  }

  // User is authenticated or accessing public routes, proceed normally
  return <Outlet />;
};

export default ProtectedLayout;
