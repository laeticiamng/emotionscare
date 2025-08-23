import React, { Suspense, memo, lazy, ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformance } from '@/contexts/PerformanceContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { ErrorBoundary } from 'react-error-boundary';

interface OptimizedRouteProps {
  component: ComponentType<any>;
  requireAuth?: boolean;
  allowedRoles?: string[];
  preload?: boolean;
  fallback?: ComponentType;
}

/**
 * Composant de route ultra-optimisé avec lazy loading, auth, et gestion d'erreurs
 */
const OptimizedRoute = memo<OptimizedRouteProps>(({
  component: Component,
  requireAuth = false,
  allowedRoles = [],
  preload = false,
  fallback: Fallback
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { optimizationLevel } = usePerformance();
  
  // Fallback d'erreur optimisé
  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md p-6 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold">Erreur de chargement</h2>
        <p className="text-muted-foreground text-sm">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
  
  // Fallback de chargement adaptatif selon les performances
  const LoadingFallback = () => {
    const showAdvancedLoader = optimizationLevel === 'high';
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className={`space-y-4 ${showAdvancedLoader ? 'animate-pulse' : ''}`}>
          {Fallback ? <Fallback /> : <LoadingAnimation />}
          {optimizationLevel === 'low' && (
            <div className="text-xs text-muted-foreground text-center">
              Mode économie d'énergie activé
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Vérifications d'authentification
  if (authLoading) {
    return <LoadingFallback />;
  }
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Route Error:', error, errorInfo);
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
});

OptimizedRoute.displayName = 'OptimizedRoute';

/**
 * Factory pour créer des routes optimisées avec lazy loading
 */
export const createOptimizedRoute = (
  factory: () => Promise<{ default: ComponentType<any> }>,
  options: Omit<OptimizedRouteProps, 'component'> = {}
) => {
  const LazyComponent = lazy(factory);
  
  return memo(() => (
    <OptimizedRoute component={LazyComponent} {...options} />
  ));
};

/**
 * Hook pour précharger des routes de manière optimisée
 */
export const useRoutePreloader = () => {
  const { optimizationLevel } = usePerformance();
  
  const preloadRoute = React.useCallback((factory: () => Promise<{ default: ComponentType<any> }>) => {
    if (optimizationLevel === 'low') return; // Pas de préchargement en mode économie
    
    // Précharger uniquement si on a de la bande passante
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        return; // Pas de préchargement sur connexion lente
      }
    }
    
    // Utiliser requestIdleCallback si disponible
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        factory().catch(() => {
          // Ignore les erreurs de préchargement
        });
      });
    } else {
      setTimeout(() => {
        factory().catch(() => {
          // Ignore les erreurs de préchargement
        });
      }, 100);
    }
  }, [optimizationLevel]);
  
  return { preloadRoute };
};

export default OptimizedRoute;