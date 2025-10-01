// @ts-nocheck

import { useCallback } from 'react';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';

/**
 * Hook pour effectuer des appels API sécurisés avec gestion du token
 * Utilise uniquement GlobalInterceptor (AuthInterceptor supprimé)
 */
export const useSecureApiCall = () => {
  const { handleError } = useApiErrorHandler();

  const secureCall = useCallback(async (
    url: string,
    options: RequestInit = {},
    context?: string
  ): Promise<Response | null> => {
    try {
      const response = await GlobalInterceptor.secureFetch(url, options);
      
      if (!response) {
        await handleError({ status: 500 }, context);
        return null;
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
  }, [handleError]);

  return { secureCall };
};
