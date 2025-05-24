
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification de l'authentification..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion appropriée selon le rôle requis
    if (requiredRole === 'b2c') {
      return <Navigate to="/b2c/login" state={{ from: location }} replace />;
    } else if (requiredRole === 'b2b_user') {
      return <Navigate to="/b2b/user/login" state={{ from: location }} replace />;
    } else if (requiredRole === 'b2b_admin') {
      return <Navigate to="/b2b/admin/login" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/choose-mode" state={{ from: location }} replace />;
    }
  }

  // Vérifier le rôle si spécifié
  if (requiredRole && user?.user_metadata?.role !== requiredRole) {
    return <Navigate to="/choose-mode" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
