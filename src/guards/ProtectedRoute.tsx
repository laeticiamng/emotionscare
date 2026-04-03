// @ts-nocheck
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { routes } from '@/routerV2/routes';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import type { UserRole } from '@/types/user';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
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
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-foreground">Chargement...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = location.pathname + location.search;
    logger.info('ProtectedRoute: redirecting to login', { from: redirectPath }, 'AUTH');
    return <Navigate to={routes.special.chooseMode()} state={{ from: redirectPath }} replace />;
  }

  // Vérification des rôles si spécifiés
  const rolesToCheck = requiredRole ? [requiredRole, ...(allowedRoles || [])] : (allowedRoles || []);
  if (rolesToCheck.length > 0 && user) {
    const userRole = (user.role || user.user_metadata?.role) as UserRole;
    if (!rolesToCheck.includes(userRole)) {
      logger.warn('ProtectedRoute: insufficient role', {
        from: location.pathname,
        userRole,
        requiredRole,
        allowedRoles,
      }, 'AUTH');
      // Rediriger vers le dashboard approprié selon le rôle
      const dashboardMap: Record<UserRole, string> = {
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
