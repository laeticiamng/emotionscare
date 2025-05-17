
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { useAuth } from '@/contexts/AuthContext';
import { UserModeType } from '@/types/userMode';

interface ProtectedRouteWithModeProps {
  children: React.ReactNode;
  requiredMode: UserModeType;
  redirectTo?: string;
}

const ProtectedRouteWithMode: React.FC<ProtectedRouteWithModeProps> = ({
  children,
  requiredMode,
  redirectTo = '/'
}) => {
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const location = useLocation();

  // Add debug logging to track dashboard access issues
  useEffect(() => {
    console.log('[ProtectedRouteWithMode] Current location:', location.pathname);
    console.log('[ProtectedRouteWithMode] User authenticated:', isAuthenticated);
    console.log('[ProtectedRouteWithMode] User role:', user?.role);
    console.log('[ProtectedRouteWithMode] User mode:', userMode);
    console.log('[ProtectedRouteWithMode] Required mode:', requiredMode);
    
    // Check if the user mode and role are consistent
    if (user?.role) {
      const normalizedRole = normalizeUserMode(user.role);
      const normalizedMode = normalizeUserMode(userMode);
      
      if (normalizedRole !== normalizedMode) {
        console.warn('[ProtectedRouteWithMode] User role and mode mismatch:', {
          role: user.role,
          normalizedRole,
          userMode,
          normalizedMode
        });
      }
    }
  }, [location.pathname, isAuthenticated, user?.role, userMode, requiredMode]);

  // Show loading state if still loading
  if (authLoading || userModeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('[ProtectedRouteWithMode] Redirecting to login: user not authenticated');
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If user is authenticated but doesn't have the required mode, redirect to the specified page
  if (normalizeUserMode(userMode) !== normalizeUserMode(requiredMode)) {
    console.log('[ProtectedRouteWithMode] Redirecting: incorrect user mode', {
      userMode: normalizeUserMode(userMode),
      requiredMode: normalizeUserMode(requiredMode),
      redirectTo
    });
    return <Navigate to={redirectTo} />;
  }

  // If user is authenticated and has the required mode, proceed
  return <>{children}</>;
};

export default ProtectedRouteWithMode;
