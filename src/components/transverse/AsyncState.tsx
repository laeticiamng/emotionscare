// @ts-nocheck
import React from 'react';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AsyncStateProps {
  isLoading?: boolean;
  error?: Error | string | null;
  isEmpty?: boolean;
  className?: string;
  children?: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
}

export const AsyncState: React.FC<AsyncStateProps> = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  className,
  children,
  loadingMessage = "Chargement...",
  errorMessage,
  emptyMessage = "Aucune donnée disponible",
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    const errorText = typeof error === 'string' ? error : error.message;
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Une erreur est survenue
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {errorMessage || errorText}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucune donnée</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};