
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
    return <Navigate to={redirectTo || '/login'} state={{ from: location }} />;
  }

  // If role is required and user doesn't have it, redirect
  if (requiredRole && user?.role !== requiredRole) {
    // Safely compare as strings
    return <Navigate to="/unauthorized" />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
