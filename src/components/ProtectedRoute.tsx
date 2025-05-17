
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
  requiredRole,
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if auth state is still being determined
  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated) {
    // Déterminer quelle page de login utiliser en fonction du chemin actuel
    let loginPath = '/b2c/login';
    
    if (location.pathname.includes('/b2b/admin')) {
      loginPath = '/b2b/admin/login';
    } else if (location.pathname.includes('/b2b/user')) {
      loginPath = '/b2b/user/login';
    }
    
    return <Navigate to={loginPath} state={{ from: location }} />;
  }

  // Si un rôle spécifique est requis et que l'utilisateur ne l'a pas, rediriger
  if (requiredRole && user?.role !== requiredRole) {
    // Si l'utilisateur est connecté mais n'a pas le bon rôle, rediriger vers son tableau de bord par défaut
    const userDashboardPath = user?.role === 'b2b_admin' 
      ? '/b2b/admin' 
      : user?.role === 'b2b_user' 
        ? '/b2b/user' 
        : '/b2c';
    
    return <Navigate to={userDashboardPath} />;
  }

  // User is authenticated and has required role (or no specific role required)
  return <>{children}</>;
};

export default ProtectedRoute;
