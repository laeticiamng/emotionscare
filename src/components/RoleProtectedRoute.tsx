import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Composant de protection des routes par rôle
 * Vérification complète de l'accès des pages pour l'utilisateur
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/auth'
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  const location = useLocation();

  // Affichage du loading pendant la vérification
  if (authLoading || modeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification des autorisations..." />
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Vérification du mode utilisateur
  if (!userMode) {
    return <Navigate to="/choose-mode" replace />;
  }

  // Vérification des rôles autorisés
  if (allowedRoles.length > 0) {
    const userRole = user?.role || userMode;
    
    if (!allowedRoles.includes(userRole)) {
      // Redirection selon le rôle de l'utilisateur
      switch (userRole) {
        case 'b2c':
          return <Navigate to="/b2c/dashboard" replace />;
        case 'b2b_user':
          return <Navigate to="/b2b/user/dashboard" replace />;
        case 'b2b_admin':
          return <Navigate to="/b2b/admin/dashboard" replace />;
        default:
          return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;