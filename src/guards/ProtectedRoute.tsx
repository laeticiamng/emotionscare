import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { routes } from '@/routerV2/routes';
import { Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowedRoles = []
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Sauvegarder la route demandée pour redirection après connexion
    const redirectPath = location.pathname + location.search;
    return <Navigate to={routes.special.chooseMode()} state={{ from: redirectPath }} replace />;
  }

  // Vérification des rôles si spécifiés
  const rolesToCheck = requiredRole ? [requiredRole] : allowedRoles;
  if (rolesToCheck.length > 0 && user) {
    const userRole = user.role || user.user_metadata?.role;
    if (!rolesToCheck.includes(userRole)) {
      // Rediriger vers le dashboard approprié selon le rôle
      const dashboardMap: Record<string, string> = {
        'b2c': routes.b2c.dashboard(),
        'b2b_user': routes.b2b.user.dashboard(), 
        'b2b_admin': routes.b2b.admin.dashboard()
      };
      return <Navigate to={dashboardMap[userRole] || routes.special.chooseMode()} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
