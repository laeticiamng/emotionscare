
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import LoadingAnimation from '@/components/ui/loading-animation';

// Routes publiques autorisées selon les spécifications
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
  const [isInitialized, setIsInitialized] = useState(false);
  const { 
    isAuthenticated, 
    isLoading, 
    setSession, 
    setLoading, 
    initialize,
    refreshSession 
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

            console.log('🔐 Auth state change:', event, !!session);
            
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
        console.error('❌ Auth initialization failed:', error);
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
