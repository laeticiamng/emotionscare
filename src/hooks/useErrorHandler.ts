
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { captureAppError } from '@/lib/sentry-config';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
  tags?: Record<string, string>;
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
      reportToService = true,
      tags,
    } = options;

    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
    const fullContext = context ? `[${context}] ${errorMessage}` : errorMessage;

    if (logToConsole) {
      console.error(fullContext, error);
    }

    let sentryEventId: string | undefined;
    if (reportToService) {
      sentryEventId = captureAppError(error, {
        tags: { ...tags, context: context ?? 'global' },
        userMessage: errorMessage,
      });

      if (sentryEventId && import.meta.env.DEV) {
        console.info('[Sentry] captured error', sentryEventId);
      }
    }

    if (showToast) {
      toast({
        title: "Erreur",
        description: sentryEventId ? `${errorMessage} (code ${sentryEventId.slice(0, 8)})` : errorMessage,
        variant: "destructive",
      });
    }

    return {
      message: errorMessage,
      context: fullContext,
      timestamp: new Date().toISOString(),
      sentryEventId,
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
