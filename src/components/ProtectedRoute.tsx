
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'b2c',
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if auth state is still being determined
  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo || getRoleLoginPath(requiredRole)} state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  const hasRequiredRole = user && user.role && hasRoleAccess(user.role, requiredRole);

  if (!hasRequiredRole) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role, render the children
  return <>{children}</>;
};

// Helper function to determine if the user has access based on role hierarchy
export const hasRoleAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Admin has access to all resources
  if (userRole === 'b2b_admin') return true;
  
  // B2B user has access to b2b_user and b2c resources
  if (userRole === 'b2b_user') return requiredRole !== 'b2b_admin';
  
  // B2C users only have access to b2c resources
  return userRole === requiredRole;
};

// Helper function to get the login path based on role
export const getRoleLoginPath = (role: UserRole): string => {
  switch(role) {
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2c':
    default:
      return '/b2c/login';
  }
};

export default ProtectedRoute;
