/**
 * QueryStateWrapper - Consistent loading, error, and empty state handling
 * for React Query results. Prevents silent failures and infinite spinners.
 */

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

interface QueryStateWrapperProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null | unknown;
  isEmpty?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  onRetry?: () => void;
  timeoutMs?: number;
}

const QueryStateWrapper: React.FC<QueryStateWrapperProps> = ({
  isLoading,
  isError,
  error,
  isEmpty = false,
  children,
  loadingText = 'Chargement...',
  errorText = 'Une erreur est survenue',
  emptyText = 'Aucune donnée disponible',
  onRetry,
  timeoutMs = 15000,
}) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [isLoading, timeoutMs]);

  if (isLoading && hasTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertTriangle className="w-8 h-8 text-yellow-500" />
        <p className="text-sm text-muted-foreground text-center">
          Le chargement prend plus de temps que prévu.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingAnimation text={loadingText} />
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : String(error || errorText);
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">{errorText}</p>
          <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2">
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryStateWrapper;
