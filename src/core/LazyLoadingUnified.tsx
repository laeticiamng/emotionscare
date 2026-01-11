// @ts-nocheck
/**
 * UNIFIED LAZY LOADING SYSTEM - Production Ready
 * Centralizes all lazy loading with intelligent preloading and error handling
 */

import React, { Suspense, ComponentType, lazy, useEffect, useState } from 'react';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { logProductionEvent } from '@/utils/consoleCleanup';

interface LazyComponentOptions {
  preload?: boolean;
  fallback?: ComponentType;
  chunkName?: string;
  retryCount?: number;
}

interface LazyLoadState {
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * Enhanced lazy component creator with retry logic and preloading
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) => {
  const { preload = false, fallback: CustomFallback, chunkName, retryCount = 3 } = options;
  
  let componentCache: Promise<{ default: T }> | null = null;
  
  const LazyComponent = lazy(() => {
    if (componentCache) {
      return componentCache;
    }
    
    componentCache = importFn().catch(async (error) => {
      logProductionEvent('Lazy Loading Error', { chunkName, error: error.message }, 'error');
      
      // Retry logic
      for (let i = 0; i < retryCount; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          return await importFn();
        } catch (retryError) {
          if (i === retryCount - 1) {
            throw retryError;
          }
        }
      }
      throw error;
    });
    
    return componentCache;
  });
  
  // Preload if requested
  if (preload && typeof window !== 'undefined') {
    componentCache = importFn();
  }
  
  const WrappedComponent: ComponentType<any> = (props) => {
    
    const Fallback = CustomFallback || (() => (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-muted-foreground">
          Chargement{chunkName ? ` ${chunkName}` : ''}...
        </span>
      </div>
    ));
    
    const ErrorFallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
      <div className="flex items-center justify-center p-8 bg-destructive/10 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Erreur de chargement
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || 'Une erreur est survenue lors du chargement du composant'}
          </p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
    
    return (
      <EnhancedErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<Fallback />}>
          <LazyComponent {...props} />
        </Suspense>
      </EnhancedErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `LazyComponent(${chunkName || 'Unknown'})`;
  WrappedComponent.preload = () => {
    if (!componentCache) {
      componentCache = importFn();
    }
    return componentCache;
  };
  
  return WrappedComponent;
};

/**
 * Intelligent preloading based on user interaction
 */
export const useSmartPreload = (components: Array<{ importFn: () => Promise<any>; trigger: string }>) => {
  useEffect(() => {
    const handleInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      
      components.forEach(({ importFn, trigger }) => {
        if (target.matches(trigger) || target.closest(trigger)) {
          // Preload on hover with debounce
          const timeoutId = setTimeout(() => {
            importFn().catch(() => {}); // Silent fail
          }, 100);
          
          const cleanup = () => clearTimeout(timeoutId);
          target.addEventListener('mouseleave', cleanup, { once: true });
        }
      });
    };
    
    document.addEventListener('mouseenter', handleInteraction, true);
    
    return () => {
      document.removeEventListener('mouseenter', handleInteraction, true);
    };
  }, [components]);
};

/**
 * Route-based code splitting
 */
export const createRouteComponent = (
  importFn: () => Promise<any>,
  routeName: string
) => {
  return createLazyComponent(importFn, {
    chunkName: `route-${routeName}`,
    preload: false,
    retryCount: 2
  });
};

/**
 * Feature-based code splitting
 */
export const createFeatureComponent = (
  importFn: () => Promise<any>,
  featureName: string,
  isEnabled: boolean = true
) => {
  if (!isEnabled) {
    return () => (
      <div className="p-4 text-center text-muted-foreground">
        Fonctionnalité {featureName} non disponible
      </div>
    );
  }
  
  return createLazyComponent(importFn, {
    chunkName: `feature-${featureName}`,
    preload: false,
    retryCount: 1
  });
};

/**
 * Critical path components (preloaded)
 */
export const createCriticalComponent = (
  importFn: () => Promise<any>,
  componentName: string
) => {
  return createLazyComponent(importFn, {
    chunkName: `critical-${componentName}`,
    preload: true,
    retryCount: 5
  });
};

/**
 * Bundle size analyzer
 */
export const analyzeBundleImpact = () => {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource' && entry.name.includes('chunk')) {
        logProductionEvent('Chunk Loaded', {
          name: entry.name,
          size: (entry as any).transferSize || 0,
          loadTime: entry.duration
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
  
  return () => observer.disconnect();
};

/**
 * Component registry for better debugging
 */
class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components = new Map<string, ComponentType<any>>();
  
  static getInstance() {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }
  
  register(name: string, component: ComponentType<any>) {
    this.components.set(name, component);
    if (import.meta.env.MODE === 'development') {
      logProductionEvent('Component Registered', { name });
    }
  }
  
  get(name: string) {
    return this.components.get(name);
  }
  
  list() {
    return Array.from(this.components.keys());
  }
}

export const componentRegistry = ComponentRegistry.getInstance();

/**
 * HOC for automatic component registration
 */
export const withRegistration = <P extends object>(
  Component: ComponentType<P>,
  name: string
) => {
  componentRegistry.register(name, Component);
  
  const RegisteredComponent = (props: P) => <Component {...props} />;
  RegisteredComponent.displayName = `Registered(${name})`;
  
  return RegisteredComponent;
};