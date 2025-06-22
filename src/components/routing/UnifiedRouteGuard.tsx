
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import LoadingAnimation from '@/components/ui/loading-animation';

interface UnifiedRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

const UnifiedRouteGuard: React.FC<UnifiedRouteGuardProps> = ({
  children,
  allowedRoles = [],
  redirectTo,
  requireAuth = true
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  const location = useLocation();

  // Chargement en cours
  if (authLoading || modeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Vérification des autorisations..." />
      </div>
    );
  }

  // Vérification de l'authentification
  if (requireAuth && !isAuthenticated) {
    // Redirection selon le contexte
    if (location.pathname.startsWith('/b2b/admin')) {
      return <Navigate to={UNIFIED_ROUTES.B2B_ADMIN_LOGIN} replace />;
    } else if (location.pathname.startsWith('/b2b/user')) {
      return <Navigate to={UNIFIED_ROUTES.B2B_USER_LOGIN} replace />;
    } else if (location.pathname.startsWith('/b2c')) {
      return <Navigate to={UNIFIED_ROUTES.B2C_LOGIN} replace />;
    } else {
      return <Navigate to={redirectTo || UNIFIED_ROUTES.CHOOSE_MODE} replace />;
    }
  }

  // Vérification des rôles autorisés
  if (allowedRoles.length > 0 && isAuthenticated) {
    const currentRole = user?.role || userMode;
    
    if (!allowedRoles.includes(currentRole)) {
      // Redirection vers le dashboard approprié
      switch (currentRole) {
        case 'b2c':
          return <Navigate to={UNIFIED_ROUTES.B2C_DASHBOARD} replace />;
        case 'b2b_user':
          return <Navigate to={UNIFIED_ROUTES.B2B_USER_DASHBOARD} replace />;
        case 'b2b_admin':
          return <Navigate to={UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD} replace />;
        default:
          return <Navigate to={UNIFIED_ROUTES.HOME} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default UnifiedRouteGuard;
