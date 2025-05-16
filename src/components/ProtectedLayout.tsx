
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

  // If user is not authenticated, redirect to appropriate login page
  if (!isAuthenticated) {
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
  if (isAuthenticated && !userMode && !location.pathname.includes('/choose-mode')) {
    return <Navigate to="/choose-mode" replace />;
  }

  // User is authenticated and has completed necessary steps, show protected content
  return <Outlet />;
};

export default ProtectedLayout;
