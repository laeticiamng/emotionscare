
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const ProtectedRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const location = useLocation();
  
  // For now, we'll simply wrap the Outlet with our authentication check
  // This basic implementation can be expanded with additional logic as needed
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
