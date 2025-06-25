
import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

// Routes publiques autorisées - définition stricte selon le ticket
const PUBLIC_ROUTES = [
  '/',
  '/choose-mode',
  '/b2c/login',
  '/b2c/register',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/admin/login',
  '/help-center'
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  useEffect(() => {
    console.log('🔐 AuthGuard check:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      userMode,
      modeLoading
    });
  }, [location.pathname, isAuthenticated, isLoading, userMode, modeLoading]);

  // Chargement en cours
  if (isLoading || modeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Vérification de l'authentification..." size="lg" />
      </div>
    );
  }

  // Vérifier si la route actuelle est publique
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // Si route publique, autoriser l'accès
  if (isPublicRoute) {
    console.log('✅ Public route access granted:', location.pathname);
    return <>{children}</>;
  }

  // Si route protégée et utilisateur non authentifié
  if (!isAuthenticated) {
    console.log('🚫 Access denied - not authenticated, redirecting...');
    
    // Déterminer la page de connexion appropriée selon la route
    let loginPath = '/choose-mode';
    
    if (location.pathname.startsWith('/b2c')) {
      loginPath = '/b2c/login';
    } else if (location.pathname.startsWith('/b2b/user')) {
      loginPath = '/b2b/user/login';
    } else if (location.pathname.startsWith('/b2b/admin')) {
      loginPath = '/b2b/admin/login';
    }
    
    // Sauvegarder la route de destination pour redirection après connexion
    const redirectTo = `${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectTo} replace />;
  }

  // Utilisateur authentifié, autoriser l'accès
  console.log('✅ Authenticated access granted:', location.pathname);
  return <>{children}</>;
};

export default AuthGuard;
