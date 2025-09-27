import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AppError } from '@/lib/errors/types';
import { toAppError } from '@/lib/errors/normalize';
import { toastError } from '@/components/error/ErrorToast';
import { captureHandledError, addErrorBreadcrumb } from '@/lib/errors/sentry';

export interface ErrorContextValue {
  notify: (error: unknown, context?: Record<string, unknown>) => AppError;
  lastError: AppError | null;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastError, setLastError] = useState<AppError | null>(null);

  const notify = useCallback((error: unknown, context?: Record<string, unknown>) => {
    const baseError = toAppError(error);
    const contextCopy = context ? { ...context } : undefined;
    let suppressToast = false;
    if (contextCopy && 'suppressToast' in contextCopy) {
      suppressToast = Boolean((contextCopy as Record<string, unknown>)['suppressToast']);
      delete (contextCopy as Record<string, unknown>)['suppressToast'];
    }

    const mergedContext = {
      ...(baseError.context ?? {}),
      ...(contextCopy ?? {}),
    };

    const enrichedError: AppError = {
      ...baseError,
      context: Object.keys(mergedContext).length > 0 ? mergedContext : baseError.context,
    };

    setLastError(enrichedError);

    addErrorBreadcrumb('error.notify', {
      code: enrichedError.code,
      messageKey: enrichedError.messageKey,
      context: mergedContext,
    });

    if (!suppressToast) {
      toastError(enrichedError);
    }
    captureHandledError(enrichedError, contextCopy);

    return enrichedError;
  }, []);

  const value = useMemo<ErrorContextValue>(() => ({
    notify,
    lastError,
  }), [notify, lastError]);

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

export function useErrorHandler(): ErrorContextValue {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }

  return context;
}

export { ErrorContext };
