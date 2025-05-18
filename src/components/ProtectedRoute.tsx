
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { normalizeUserMode } from '@/utils/userModeHelpers';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();



  // Show loading state if auth state is still being determined
  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated) {
    // Determine which login page to use based on the current path
    let loginPath = '/b2c/login';
    
    if (location.pathname.includes('/b2b/admin')) {
      loginPath = '/b2b/admin/login';
    } else if (location.pathname.includes('/b2b/user')) {
      loginPath = '/b2b/user/login';
    }
    
    return <Navigate to={loginPath} state={{ from: location }} />;
  }

  // If a specific role is required and the user doesn't have it, redirect
  if (requiredRole && user?.role) {
    const normalizedUserRole = normalizeUserMode(user.role);
    const normalizedRequiredRole = normalizeUserMode(requiredRole);
    
    if (normalizedUserRole !== normalizedRequiredRole) {
      // If user is authenticated but doesn't have the right role, redirect to their default dashboard
      const userDashboardPath = normalizedUserRole === 'b2b_admin'
        ? '/b2b/admin/dashboard'
        : normalizedUserRole === 'b2b_user'
          ? '/b2b/user/dashboard'
          : '/b2c/dashboard';
      
      return <Navigate to={redirectTo || userDashboardPath} />;
    }
  }

  // User is authenticated and has required role (or no specific role required)
  return <>{children}</>;
};

export default ProtectedRoute;
