
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasRoleAccess, getRoleLoginPath } from '@/utils/roleUtils';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: UserRole;
  redirectTo?: string;
}

/**
 * Protected route component that checks if user is authenticated and has the correct role
 * Redirects to login page or specified path if conditions aren't met
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  role,
  redirectTo
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Not authenticated, redirect to login with return url
    return <Navigate to={redirectTo || getRoleLoginPath(role)} state={{ from: location }} replace />;
  }
  
  if (user?.role && !hasRoleAccess(user.role, [role])) {
    // Authenticated but wrong role, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has the correct role
  return <>{children}</>;
};

export default ProtectedRoute;
