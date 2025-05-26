
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIllustration />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/choose-mode" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/choose-mode" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
