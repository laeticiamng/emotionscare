
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { routes } from '@/routerV2';

/**
 * Hook pour gérer les erreurs d'authentification
 */
export const useAuthErrorHandler = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleAuthError = useCallback(async (error: any) => {
    if (error?.status === 401) {
      console.warn('[Auth] Token expired or invalid, logging out user');
      
      try {
        await signOut();
      } catch (signOutError) {
        console.error('[Auth] Error during signout:', signOutError);
      }

      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter.",
        variant: "destructive",
      });

      // Rediriger vers la page de choix de mode
      navigate(routes.b2c.home());
    }
  }, [navigate, signOut]);

  return { handleAuthError };
};
