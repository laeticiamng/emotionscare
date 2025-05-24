
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/choose-mode" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/choose-mode" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
