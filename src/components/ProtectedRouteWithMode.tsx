
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { UserModeType } from '@/types/userMode';

interface ProtectedRouteWithModeProps {
  children: React.ReactNode;
  requiredMode: UserModeType;
  redirectTo?: string;
}

const ProtectedRouteWithMode: React.FC<ProtectedRouteWithModeProps> = ({
  children,
  requiredMode,
  redirectTo = '/choose-mode'
}) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const location = useLocation();
  
  // Show loading state if auth or userMode is still loading
  if (authLoading || userModeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    let loginPath = '/login';
    
    // Determine which login page to redirect to based on the required mode
    if (requiredMode === 'b2b_admin') {
      loginPath = '/b2b/admin/login';
    } else if (requiredMode === 'b2b_user') {
      loginPath = '/b2b/user/login';
    } else {
      loginPath = '/b2c/login';
    }
    
    return <Navigate to={loginPath} state={{ from: location }} />;
  }
  
  // If authenticated but wrong user mode, redirect to choose mode
  const normalizedUserMode = normalizeUserMode(userMode);
  const normalizedRequiredMode = normalizeUserMode(requiredMode);
  
  if (normalizedUserMode !== normalizedRequiredMode) {
    return <Navigate to={redirectTo} state={{ from: location }} />;
  }
  
  // User is authenticated and has the required mode
  return <>{children}</>;
};

export default ProtectedRouteWithMode;
