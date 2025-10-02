import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { routes } from '@/routerV2';
import { logger } from '@/lib/logger';

/**
 * Hook pour gérer les erreurs d'authentification
 */
export const useAuthErrorHandler = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleAuthError = useCallback(async (error: unknown) => {
    const err = error as { status?: number };
    
    if (err?.status === 401) {
      logger.warn('Token expired or invalid, logging out user', undefined, 'AUTH');
      
      try {
        await signOut();
      } catch (signOutError) {
        logger.error('Error during signout', signOutError as Error, 'AUTH');
      }

      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter.",
        variant: "destructive",
      });

      navigate(routes.b2c.home());
    }
  }, [navigate, signOut]);

  return { handleAuthError };
};
