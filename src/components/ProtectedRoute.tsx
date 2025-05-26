
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.info('ProtectedRoute - Auth state:', {
    user,
    isAuthenticated,
    isLoading,
    requiredRole
  });

  if (isLoading) {
    return <LoadingIllustration />;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login based on current path
    const redirectPath = location.pathname.startsWith('/b2b/admin') 
      ? '/b2b/admin/login'
      : location.pathname.startsWith('/b2b/user')
      ? '/b2b/user/login'
      : '/b2c/login';
    
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user) {
    const userRole = user.role;
    const normalizedUserRole = userRole?.toLowerCase();
    const normalizedRequiredRole = requiredRole?.toLowerCase();

    console.info('ProtectedRoute - Role check:', {
      userRole,
      normalizedUserRole,
      requiredRole,
      normalizedRequiredRole
    });

    if (normalizedUserRole !== normalizedRequiredRole) {
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = userRole === 'b2b_admin' 
        ? '/b2b/admin/dashboard'
        : userRole === 'b2b_user'
        ? '/b2b/user/dashboard'
        : '/b2c/dashboard';
      
      return <Navigate to={dashboardPath} replace />;
    }
  }

  console.info('ProtectedRoute - Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
