
import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { OFFICIAL_ROUTES } from '@/routesManifest';

// Routes publiques autorisées
const PUBLIC_ROUTES = [
  OFFICIAL_ROUTES.HOME,
  OFFICIAL_ROUTES.CHOOSE_MODE,
  OFFICIAL_ROUTES.B2C_LOGIN,
  OFFICIAL_ROUTES.B2C_REGISTER,
  OFFICIAL_ROUTES.B2B_USER_LOGIN,
  OFFICIAL_ROUTES.B2B_USER_REGISTER,
  OFFICIAL_ROUTES.B2B_ADMIN_LOGIN,
  OFFICIAL_ROUTES.HELP_CENTER
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  // Chargement en cours
  if (isLoading || modeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Vérification de l'authentification..." size="lg" />
      </div>
    );
  }

  // Vérifier si la route actuelle est publique
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname as any);

  // Si route publique, autoriser l'accès
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Si route protégée et utilisateur non authentifié
  if (!isAuthenticated) {
    // Déterminer la page de connexion appropriée selon la route
    let loginPath = OFFICIAL_ROUTES.CHOOSE_MODE;
    
    if (location.pathname.startsWith('/b2c')) {
      loginPath = OFFICIAL_ROUTES.B2C_LOGIN;
    } else if (location.pathname.startsWith('/b2b/user')) {
      loginPath = OFFICIAL_ROUTES.B2B_USER_LOGIN;
    } else if (location.pathname.startsWith('/b2b/admin')) {
      loginPath = OFFICIAL_ROUTES.B2B_ADMIN_LOGIN;
    }
    
    // Sauvegarder la route de destination pour redirection après connexion
    const redirectTo = `${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectTo} replace />;
  }

  // Utilisateur authentifié, autoriser l'accès
  return <>{children}</>;
};

export default AuthGuard;
