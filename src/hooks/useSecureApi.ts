
import { useCallback } from 'react';
import { AuthInterceptor } from '@/utils/authInterceptor';
import { SecureAnalytics } from '@/utils/secureAnalytics';

/**
 * Hook pour effectuer des appels API sécurisés
 * Mis à jour pour conformité JWT stricte
 */
export const useSecureApi = () => {
  
  /**
   * Appel API sécurisé avec gestion d'erreur automatique
   */
  const secureCall = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response | null> => {
    return AuthInterceptor.secureFetch(url, options);
  }, []);

  /**
   * Appel analytics sécurisé (ne bloque jamais l'UI)
   */
  const trackEvent = useCallback(async (
    event: string,
    data?: any,
    userId?: string
  ): Promise<void> => {
    await SecureAnalytics.trackEvent({ event, data, userId });
  }, []);

  /**
   * Vérification du statut de session avec token strict
   */
  const checkSession = useCallback(async (): Promise<boolean> => {
    return AuthInterceptor.checkSessionStatus();
  }, []);

  return {
    secureCall,
    trackEvent,
    checkSession,
  };
};
