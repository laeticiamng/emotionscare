
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour effectuer des appels API sécurisés avec gestion du token
 */
export const useSecureApiCall = () => {
  const { refreshToken } = useAuth();
  const { handleError } = useApiErrorHandler();

  const secureCall = useCallback(async (
    url: string,
    options: RequestInit = {},
    context?: string
  ): Promise<Response | null> => {
    try {
      // Récupérer le token d'accès
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        console.warn('[SecureAPI] No valid session found');
        await handleError({ status: 401 }, context);
        return null;
      }

      // Ajouter le token d'autorisation
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Gérer l'expiration du token
      if (response.status === 401) {
        console.log('[SecureAPI] Token might be expired, trying to refresh...');
        await refreshToken();
        
        // Retry with refreshed token
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession?.access_token) {
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              'Authorization': `Bearer ${newSession.access_token}`,
            },
          });
          
          if (retryResponse.status === 401) {
            await handleError({ status: 401 }, context);
            return null;
          }
          
          return retryResponse;
        } else {
          await handleError({ status: 401 }, context);
          return null;
        }
      }

      if (!response.ok) {
        await handleError({ status: response.status }, context);
        return null;
      }

      return response;
    } catch (error: any) {
      await handleError(error, context);
      return null;
    }
  }, [refreshToken, handleError]);

  return { secureCall };
};
