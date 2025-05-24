
import { useState } from 'react';
import { secureApiClient } from '@/lib/security/apiClient';

/**
 * Hook pour utiliser l'API sécurisée
 */
export const useSecureApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = async <T>(
    request: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await request();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeEmotion = (text: string) => {
    return executeRequest(() => secureApiClient.analyzeEmotion(text));
  };

  const sendInvitation = (email: string, role: string, organizationId?: string) => {
    return executeRequest(() => secureApiClient.sendInvitation(email, role, organizationId));
  };

  return {
    isLoading,
    error,
    analyzeEmotion,
    sendInvitation,
  };
};
