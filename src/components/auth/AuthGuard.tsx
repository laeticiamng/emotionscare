import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store';
import LoadingAnimation from '@/components/ui/loading-animation';
import { logger } from '@/lib/logger';

// Routes publiques autorisées selon les spécifications
const PUBLIC_ROUTES = [
  '/',
  '/choose-mode',
  '/login',
  '/signup',
  '/b2c',
  '/entreprise',
  '/help'
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    isAuthenticated,
    isLoading,
    setSession,
    setLoading,
    initialize
  } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (!mounted) return;

      try {
        await initialize();
        
        // Setup auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            logger.debug('Auth state change', { event, hasSession: !!session }, 'AUTH');
            
            switch (event) {
              case 'SIGNED_IN':
              case 'TOKEN_REFRESHED':
                setSession(session);
                break;
              case 'SIGNED_OUT':
                setSession(null);
                break;
              case 'PASSWORD_RECOVERY':
              case 'USER_UPDATED':
                if (session) setSession(session);
                break;
            }
          }
        );

        if (mounted) {
          setIsInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        logger.error('Auth initialization failed', error, 'AUTH');
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [initialize, setSession, setLoading]);

  // Affichage du loading pendant l'initialisation (max 500ms selon specs)
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation 
          text="Vérification de l'authentification..." 
          size="lg" 
        />
      </div>
    );
  }

  // Vérifier si la route actuelle est publique
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // Si route publique, autoriser l'accès
  if (isPublicRoute) {
    logger.debug('Public route access granted', { pathname: location.pathname }, 'AUTH');
    return <>{children}</>;
  }

  // Si route protégée et utilisateur non authentifié
  if (!isAuthenticated) {
    logger.warn('Access denied - not authenticated, redirecting', { pathname: location.pathname }, 'AUTH');
    
    // Déterminer la page de connexion appropriée selon la route
    let loginPath = '/login';
    
    if (location.pathname.startsWith('/app/consumer')) {
      loginPath = '/login?segment=b2c';
    } else if (location.pathname.startsWith('/app/collab') || location.pathname.startsWith('/app/rh')) {
      loginPath = '/login?segment=b2b';
    } else if (location.pathname.startsWith('/entreprise')) {
      loginPath = '/login?segment=b2b';
    }
    
    // Sauvegarder la route de destination pour redirection après connexion
    const redirectTo = `${loginPath}&redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectTo} replace />;
  }

  // Utilisateur authentifié, autoriser l'accès
  logger.debug('Authenticated access granted', { pathname: location.pathname }, 'AUTH');
  return <>{children}</>;
};

export default AuthGuard;
