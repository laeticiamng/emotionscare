
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    context?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      reportToService = false
    } = options;

    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
    const fullContext = context ? `[${context}] ${errorMessage}` : errorMessage;

    if (logToConsole) {
      console.error(fullContext, error);
    }

    if (showToast) {
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }

    if (reportToService && process.env.NODE_ENV === 'production') {
      // Ici on pourrait intégrer Sentry ou un autre service de monitoring
      console.warn('Error reporting service not configured');
    }

    return {
      message: errorMessage,
      context: fullContext,
      timestamp: new Date().toISOString()
    };
  }, [toast]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context?: string,
    options?: ErrorHandlerOptions
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context, options);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};

export default useErrorHandler;
