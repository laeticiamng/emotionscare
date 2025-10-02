import React, { memo, Suspense, lazy } from 'react';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { CoachProvider } from '@/contexts/coach/UnifiedCoachContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { logProductionEvent } from '@/utils/consoleCleanup';

// Lazy load heavy components
const PerformanceMonitor = lazy(() => import('@/components/monitoring/PerformanceMonitor'));

interface OptimizedLayoutProps {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enableAccessibility?: boolean;
}

const ErrorFallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => {
  logProductionEvent('Layout Error', error, 'error');
  
  return (
    <div role="alert" className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md p-6 bg-card border rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-destructive mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-muted-foreground mb-4">
          L'application a rencontré une erreur inattendue. Veuillez réessayer.
        </p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Réessayer l'application"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" aria-label="Chargement">
    <LoadingSpinner size="lg" />
    <span className="sr-only">Chargement de l'application...</span>
  </div>
);

/**
 * OptimizedLayout - Production-ready layout with performance optimizations
 * Features: Error boundaries, lazy loading, accessibility, monitoring
 */
const OptimizedLayout: React.FC<OptimizedLayoutProps> = memo(({ 
  children, 
  enableMonitoring = true,
  enableAccessibility = true 
}) => {
  return (
    <EnhancedErrorBoundary fallback={ErrorFallback}>
      <AccessibilityProvider>
        <CoachProvider>
          <div className="min-h-screen bg-background text-foreground">
            {/* Skip Navigation Link */}
            <a
              href="#main-content"
              className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
            >
              Aller au contenu principal
            </a>
            
            {/* Main Content */}
            <main id="main-content" className="relative">
              <Suspense fallback={<LoadingFallback />}>
                {children}
              </Suspense>
            </main>
            
            {/* Enhanced Features - Lazy Loaded */}
            {/* AccessibilityEnhancer disabled for now - no default export */}
            
            {enableMonitoring && process.env.NODE_ENV === 'development' && (
              <Suspense fallback={null}>
                <PerformanceMonitor />
              </Suspense>
            )}
            
            {/* Announcements for Screen Readers */}
            <div
              id="announcements"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {/* Dynamic announcements will be inserted here */}
            </div>
          </div>
        </CoachProvider>
      </AccessibilityProvider>
    </EnhancedErrorBoundary>
  );
});

OptimizedLayout.displayName = 'OptimizedLayout';

export default OptimizedLayout;