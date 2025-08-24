import React, { Suspense, lazy, memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PerformanceProvider } from '@/contexts/PerformanceContext';
import { CacheProvider } from '@/components/optimization/CacheProvider';
import { ResourcePreloader } from '@/components/optimization/LazyComponentLoader';
import { performanceOptimizer } from '@/lib/performance/performanceOptimizer';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';

// Lazy load des providers pour réduire le bundle initial
const ThemeProvider = lazy(() => import('@/components/theme-provider').then(m => ({ default: m.ThemeProvider })));
const MusicProvider = lazy(() => import('@/contexts/MusicContext'));
const AppRouter = lazy(() => import('@/router/AppRouter'));

// Configuration optimisée du QueryClient
const createOptimizedQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Retry adaptatif basé sur le type d'erreur
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Composant de chargement optimisé
const OptimizedLoader = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse">
      <div className="h-12 w-12 bg-primary/20 rounded-full animate-bounce"></div>
    </div>
  </div>
));

OptimizedLoader.displayName = 'OptimizedLoader';

// Fallback d'erreur optimisé
const ErrorFallback = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center p-8">
      <div className="text-destructive text-6xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Erreur critique</h1>
      <p className="text-muted-foreground mb-6">
        Une erreur s'est produite lors du chargement de l'application.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Recharger l'application
      </button>
    </div>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

const App: React.FC = memo(() => {
  const [queryClient] = React.useState(createOptimizedQueryClient);

  // Monitoring des performances au démarrage
  React.useEffect(() => {
    const startTime = performance.now();
    
    performanceMonitor.recordMetric('app-init-start', startTime);
    
    // Démarrer les optimisations automatiques
    if (import.meta.env.PROD) {
      performanceOptimizer.startOptimizations();
    }

    return () => {
      const endTime = performance.now();
      performanceMonitor.recordMetric('app-init-total', endTime - startTime);
    };
  }, []);

  // Précharger les ressources critiques
  React.useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Précharger les chunks critiques
        import('@/components/theme-provider');
        import('@/contexts/MusicContext');
      });
    }
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <CacheProvider>
        <PerformanceProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<OptimizedLoader />}>
              <ThemeProvider>
                <Suspense fallback={<OptimizedLoader />}>
                  <MusicProvider>
                    <ResourcePreloader />
                    <div className="min-h-screen bg-background text-foreground">
                      <ErrorBoundary 
                        fallback={<ErrorFallback />}
                        onError={(error, errorInfo) => {
                          performanceMonitor.recordMetric('router-error', 1);
                          console.error('Router Error:', error, errorInfo);
                        }}
                      >
                        <Suspense fallback={<OptimizedLoader />}>
                          <AppRouter />
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                  </MusicProvider>
                </Suspense>
              </ThemeProvider>
            </Suspense>
            
            {/* DevTools uniquement en développement */}
            {import.meta.env.DEV && (
              <ReactQueryDevtools 
                initialIsOpen={false} 
                position="bottom-right"
              />
            )}
          </QueryClientProvider>
        </PerformanceProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;