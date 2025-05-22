
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRole,
  children 
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  
  // Show loading state while checking auth
  if (authLoading || modeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    if (requiredRole === 'b2c') {
      return <Navigate to="/b2c/login" replace />;
    } else if (requiredRole === 'b2b_user') {
      return <Navigate to="/b2b/user/login" replace />;
    } else if (requiredRole === 'b2b_admin') {
      return <Navigate to="/b2b/admin/login" replace />;
    }
    
    return <Navigate to="/login" replace />;
  }
  
  // If role is required and user doesn't have that role, redirect
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/choose-mode" replace />;
  }
  
  // If mode is required and user doesn't have that mode, redirect
  if (requiredRole && userMode !== requiredRole) {
    return <Navigate to="/choose-mode" replace />;
  }
  
  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
