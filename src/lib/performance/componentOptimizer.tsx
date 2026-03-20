/**
 * Optimiseur de composants React pour améliorer les performances
 */

import React from 'react';
import { logger, logPerformance } from '@/lib/logger';

/**
 * HOC pour optimiser les composants avec memo et monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = React.memo<P,>((props) => {
    const startTime = React.useRef<number>();
    const [renderCount, setRenderCount] = React.useState(0);

    // Mesurer le temps de rendu
    React.useEffect(() => {
      if (startTime.current) {
        const renderTime = performance.now() - startTime.current;
        logPerformance(`${componentName} render`, renderTime);
        
        if (renderTime > 16) { // Plus de 16ms = potentiel problème
          logger.warn(`Slow render detected in ${componentName}`, {
            renderTime,
            renderCount
          }, 'PERF');
        }
      }
    });

    // Compter les re-renders
    React.useEffect(() => {
      setRenderCount(prev => prev + 1);
      startTime.current = performance.now();
    });

    // Logger les re-renders excessifs
    React.useEffect(() => {
      if (renderCount > 10) {
        logger.warn(`Excessive re-renders in ${componentName}`, {
          renderCount
        }, 'PERF');
      }
    }, [renderCount]);

    return <Component {...props} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
};

/**
 * Hook pour optimiser les callbacks
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debounce = 0
): T => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const optimizedCallback = React.useCallback((...args: Parameters<T>) => {
    if (debounce > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, debounce);
    } else {
      callback(...args);
    }
  }, deps) as T;

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return optimizedCallback;
};

/**
 * Hook pour optimiser les états
 */
export const useOptimizedState = <T,>(
  initialValue: T,
  compareFn?: (prev: T, next: T) => boolean
) => {
  const [state, setState] = React.useState(initialValue);
  const stableSetState = React.useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevState)
        : newValue;
      
      if (compareFn) {
        return compareFn(prevState, nextState) ? prevState : nextState;
      }
      
      return Object.is(prevState, nextState) ? prevState : nextState;
    });
  }, [compareFn]);

  return [state, stableSetState] as const;
};

/**
 * Hook pour lazy loading conditionnel
 */
export const useConditionalLazyLoad = <T,>(
  condition: boolean,
  loader: () => Promise<T>,
  fallback?: T
) => {
  const [data, setData] = React.useState<T | undefined>(fallback);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (condition && !data) {
      setIsLoading(true);
      setError(null);
      
      loader()
        .then(result => {
          setData(result);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        });
    }
  }, [condition, data, loader]);

  return { data, isLoading, error };
};

/**
 * Component wrapper pour intersection observer
 */
export const LazyRenderWrapper: React.FC<{
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  placeholder?: React.ReactNode;
}> = ({ 
  children, 
  rootMargin = '50px', 
  threshold = 0.1,
  placeholder = <div>Chargement...</div>
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : placeholder}
    </div>
  );
};

/**
 * Hook pour gérer les listes virtualisées
 */
export const useVirtualizedList = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 3
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleRange = React.useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = React.useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
      .map((item, index) => ({
        item,
        index: visibleRange.startIndex + index,
        offset: (visibleRange.startIndex + index) * itemHeight
      }));
  }, [items, visibleRange, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    visibleRange
  };
};

/**
 * Component pour batch des updates
 */
export const BatchedUpdates: React.FC<{
  children: React.ReactNode;
  batchSize?: number;
  delay?: number;
}> = ({ children, batchSize = 10, delay = 16 }) => {
  const [updateQueue, setUpdateQueue] = React.useState<(() => void)[]>([]);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const scheduleUpdate = React.useCallback((update: () => void) => {
    setUpdateQueue(queue => {
      const newQueue = [...queue, update];
      
      if (newQueue.length >= batchSize || !timeoutRef.current) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          React.startTransition(() => {
            newQueue.forEach(update => update());
          });
          setUpdateQueue([]);
          timeoutRef.current = undefined;
        }, delay);
      }
      
      return newQueue;
    });
  }, [batchSize, delay]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <React.Provider value={{ scheduleUpdate }}>
      {children}
    </React.Provider>
  );
};

export default {
  withPerformanceMonitoring,
  useOptimizedCallback,
  useOptimizedState,
  useConditionalLazyLoad,
  LazyRenderWrapper,
  useVirtualizedList,
  BatchedUpdates
};