
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { AuthErrorHandler, ApiErrorHandler } from '@/utils/errorHandlers';

/**
 * Hook pour gérer les erreurs d'API de manière centralisée
 */
export const useApiErrorHandler = () => {
  const navigate = useNavigate();

  const handleError = useCallback(async (error: any, context?: string) => {
    if (error?.status === 401) {
      await AuthErrorHandler.handle401Error(navigate);
    } else {
      ApiErrorHandler.handleGenericError(error, context);
    }
  }, [navigate]);

  const handleAnalyticsError = useCallback((error: any, context?: string) => {
    ApiErrorHandler.handleAnalyticsError(error, context);
  }, []);

  const handleVoiceError = useCallback((error: any, context?: string) => {
    ApiErrorHandler.handleVoiceError(error, context);
  }, []);

  return {
    handleError,
    handleAnalyticsError,
    handleVoiceError,
  };
};
