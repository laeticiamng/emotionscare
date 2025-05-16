
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasRoleAccess, getRoleLoginPath } from '@/utils/roleUtils';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = 'user', 
  children
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if auth state is still being determined
  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={getRoleLoginPath(requiredRole)} state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  const hasRequiredRole = user && user.role && hasRoleAccess(user.role, requiredRole);

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user's role
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
