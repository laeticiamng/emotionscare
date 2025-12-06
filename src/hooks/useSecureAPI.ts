// @ts-nocheck
import { useCallback } from 'react';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import { SecureAnalytics } from '@/utils/secureAnalytics';

/**
 * Hook pour effectuer des appels API sécurisés avec gestion d'erreur globale
 */
export const useSecureApi = () => {
  
  /**
   * Appel API sécurisé avec gestion d'erreur automatique
   */
  const secureCall = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response | null> => {
    return GlobalInterceptor.secureFetch(url, options);
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
   * Vérification du statut de session
   */
  const checkSession = useCallback(async (): Promise<boolean> => {
    return GlobalInterceptor.checkSessionStatus();
  }, []);

  /**
   * Get analytics service status
   */
  const getAnalyticsStatus = useCallback(() => {
    return SecureAnalytics.getStatus();
  }, []);

  return {
    secureCall,
    trackEvent,
    checkSession,
    getAnalyticsStatus,
  };
};
