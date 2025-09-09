/**
 * RouterV2 Guards - Protection des routes par rôle
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { routes } from './routes';
import LoadingAnimation from '@/components/ui/loading-animation';
import type { Role } from './schema';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

/**
 * Guard unifié pour protéger les routes
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRole,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  // Chargement en cours
  if (authLoading || modeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Vérification des autorisations..." />
      </div>
    );
  }

  // Authentification requise
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={routes.auth.login()} replace />;
  }

  // Vérification des rôles
  if (isAuthenticated && (requiredRole || allowedRoles.length > 0)) {
    const currentRole = normalizeRole(user?.role || userMode);
    
    // Rôle spécifique requis (accès exclusif)
    if (requiredRole && currentRole !== requiredRole) {
      return <Navigate to={getDefaultDashboardForRole(currentRole)} replace />;
    }
    
    // Liste de rôles autorisés (accès multiple)
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
      return <Navigate to={getDefaultDashboardForRole(currentRole)} replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Higher-Order Component pour protéger une route
 */
export function withRoleGuard(
  Component: React.ComponentType,
  requiredRole?: Role,
  options: { requireAuth?: boolean } = {}
) {
  return function GuardedComponent(props: any) {
    return (
      <RouteGuard requiredRole={requiredRole} requireAuth={options.requireAuth}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

/**
 * Normalise le rôle utilisateur vers les types RouterV2
 */
function normalizeRole(role?: string): Role {
  switch (role) {
    case 'b2c':
    case 'consumer':
      return 'consumer';
    case 'b2b_user':
    case 'employee':
      return 'employee';
    case 'b2b_admin':
    case 'manager':
      return 'manager';
    default:
      return 'consumer';
  }
}

/**
 * Retourne le dashboard par défaut selon le rôle
 */
function getDefaultDashboardForRole(role: Role): string {
  switch (role) {
    case 'consumer':
      return routes.b2c.dashboard();
    case 'employee':
      return routes.b2b.user.dashboard();
    case 'manager':
      return routes.b2b.admin.dashboard();
    default:
      return routes.b2c.dashboard();
  }
}