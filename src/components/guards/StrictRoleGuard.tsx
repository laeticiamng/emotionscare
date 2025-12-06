// @ts-nocheck
/**
 * StrictRoleGuard - Protection stricte des routes selon les rôles
 * Implémente les règles de séparation B2C/B2B
 */

// @ts-nocheck
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

interface StrictRoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  forbiddenMessage?: string;
}

/**
 * Composant de protection stricte des routes
 * Redirige vers /403 si l'utilisateur n'a pas le bon rôle
 */
const StrictRoleGuard: React.FC<StrictRoleGuardProps> = ({ 
  children, 
  allowedRoles,
  forbiddenMessage = "Accès non autorisé pour votre profil"
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

  // Non authentifié -> Redirection vers login
  if (!isAuthenticated) {
    return <Navigate to="/mode-selection" replace />;
  }

  // Déterminer le rôle actuel
  const currentRole = user?.role || userMode;
  
  // Normaliser le rôle pour les comparaisons
  const normalizedRole = normalizeRole(currentRole);
  const normalizedAllowedRoles = allowedRoles.map(role => normalizeRole(role));

  // Vérifier si le rôle est autorisé
  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    // Redirection vers 403 avec message personnalisé
    return <Navigate 
      to="/403" 
      state={{ 
        message: forbiddenMessage,
        currentRole: normalizedRole,
        allowedRoles: normalizedAllowedRoles
      }} 
      replace 
    />;
  }

  return <>{children}</>;
};

/**
 * Hook pour vérifier l'accès à une fonctionnalité
 */
export const useRoleAccess = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  const currentRole = normalizeRole(user?.role || userMode);

  const hasAccess = (allowedRoles: string[]): boolean => {
    const normalizedAllowedRoles = allowedRoles.map(role => normalizeRole(role));
    return normalizedAllowedRoles.includes(currentRole);
  };

  const canAccessSocialB2C = (): boolean => {
    return hasAccess(['b2c']);
  };

  const canAccessCollab = (): boolean => {
    return hasAccess(['b2b_user', 'b2b_admin']);
  };

  const canAccessRH = (): boolean => {
    return hasAccess(['b2b_admin']);
  };

  const canAccessPersonalTools = (): boolean => {
    return hasAccess(['b2c', 'b2b_user', 'b2b_admin']); // Tous les rôles
  };

  return {
    currentRole,
    hasAccess,
    canAccessSocialB2C,
    canAccessCollab,
    canAccessRH,
    canAccessPersonalTools
  };
};

/**
 * Composant pour afficher du contenu conditionnel selon le rôle
 */
export const RoleConditional: React.FC<{
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ allowedRoles, children, fallback = null }) => {
  const { hasAccess } = useRoleAccess();

  if (hasAccess(allowedRoles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

/**
 * Higher-Order Component pour protéger une page
 */
export const withStrictRoleGuard = (
  Component: React.ComponentType<any>,
  allowedRoles: string[],
  forbiddenMessage?: string
) => {
  return function GuardedComponent(props: any) {
    return (
      <StrictRoleGuard allowedRoles={allowedRoles} forbiddenMessage={forbiddenMessage}>
        <Component {...props} />
      </StrictRoleGuard>
    );
  };
};

/**
 * Normalise les rôles pour les comparaisons
 */
function normalizeRole(role?: string): string {
  switch (role) {
    case 'b2c':
    case 'consumer':
      return 'b2c';
    case 'b2b_user':
    case 'employee':
      return 'b2b_user';
    case 'b2b_admin':
    case 'manager':
      return 'b2b_admin';
    default:
      return 'b2c'; // Par défaut
  }
}

/**
 * Routes interdites par rôle selon la spécification
 */
export const FORBIDDEN_ROUTES = {
  // B2C ne peut pas accéder à :
  b2c: [
    '/app/collab',
    '/app/rh',
    '/social-cocon',
    '/teams',
    '/b2b/admin/*',
    '/b2b/user/*'
  ],
  
  // B2B User ne peut pas accéder à :
  b2b_user: [
    '/app/social-b2c',
    '/app/rh',
    '/b2b/admin/*'
  ],
  
  // B2B Admin ne peut pas accéder à :
  b2b_admin: [
    '/app/social-b2c'
  ]
};

export default StrictRoleGuard;