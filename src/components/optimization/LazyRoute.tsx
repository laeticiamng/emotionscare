// @ts-nocheck
import React, { Suspense, lazy, ComponentType, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingAnimation from '@/components/ui/loading-animation';
import { logger } from '@/lib/logger';

interface LazyRouteProps {
  factory: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  preload?: boolean;
}

/**
 * Composant optimisé pour le chargement lazy des routes avec error boundary
 */
const LazyRoute = memo<LazyRouteProps>(({ 
  factory, 
  fallback: Fallback = LoadingAnimation,
  errorFallback: ErrorFallback,
  preload = false 
}) => {
  // Créer le composant lazy
  const LazyComponent = React.useMemo(() => lazy(factory), [factory]);
  
  // Préchargement optionnel
  React.useEffect(() => {
    if (preload) {
      factory().catch(error => {
        logger.warn('Failed to preload component', error as Error, 'SYSTEM');
      });
    }
  }, [factory, preload]);
  
  // Fallback d'erreur par défaut
  const defaultErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Erreur de chargement
        </h2>
        <p className="text-muted-foreground mb-4">
          {error.message || 'Une erreur est survenue lors du chargement de la page.'}
        </p>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback || defaultErrorFallback}
      onError={(error, errorInfo) => {
        logger.error('LazyRoute Error', error as Error, 'SYSTEM');
      }}
    >
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <Fallback />
          </div>
        }
      >
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
});

LazyRoute.displayName = 'LazyRoute';

/**
 * Factory function pour créer des routes lazy optimisées
 */
export const createLazyRoute = (
  factory: () => Promise<{ default: ComponentType<any> }>,
  options: Omit<LazyRouteProps, 'factory'> = {}
) => {
  return () => <LazyRoute factory={factory} {...options} />;
};

/**
 * Hook pour précharger des routes
 */
export const usePreloadRoute = (factory: () => Promise<{ default: ComponentType<any> }>) => {
  const preload = React.useCallback(() => {
    factory().catch(error => {
      logger.warn('Failed to preload route', error as Error, 'SYSTEM');
    });
  }, [factory]);
  
  return preload;
};

export default LazyRoute;