
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

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but hasn't selected a mode yet (except when on the onboarding page)
  if (isAuthenticated && !userMode && !location.pathname.includes('/onboarding')) {
    return <Navigate to="/choose-mode" replace />;
  }

  // If user hasn't completed onboarding yet (except when already on the onboarding page)
  if (isAuthenticated && user && user.onboarded === false && !location.pathname.includes('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  // User is authenticated and has completed necessary steps, show protected content
  return <Outlet />;
};

export default ProtectedLayout;
