
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification de l'authentification..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion appropriée selon le chemin
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/b2c/')) {
      return <Navigate to="/b2c/login" state={{ from: location.pathname }} replace />;
    } else if (currentPath.startsWith('/b2b/user/')) {
      return <Navigate to="/b2b/user/login" state={{ from: location.pathname }} replace />;
    } else if (currentPath.startsWith('/b2b/admin/')) {
      return <Navigate to="/b2b/admin/login" state={{ from: location.pathname }} replace />;
    }
    
    return <Navigate to="/choose-mode" state={{ from: location.pathname }} replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole && user) {
    const userRole = user.user_metadata?.role || user.role;
    if (userRole !== requiredRole) {
      // Rediriger vers la page appropriée selon le rôle
      if (userRole === 'b2c') {
        return <Navigate to="/b2c/dashboard" replace />;
      } else if (userRole === 'b2b_user') {
        return <Navigate to="/b2b/user/dashboard" replace />;
      } else if (userRole === 'b2b_admin') {
        return <Navigate to="/b2b/admin/dashboard" replace />;
      }
      
      return <Navigate to="/choose-mode" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
