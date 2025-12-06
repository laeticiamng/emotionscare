// @ts-nocheck
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Eye, Zap } from 'lucide-react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  fadeIn?: boolean;
  priority?: 'low' | 'normal' | 'high';
  preload?: boolean;
}

/**
 * Composant de lazy loading avancé avec intersection observer
 * Optimise les performances en chargeant le contenu uniquement quand nécessaire
 */
export const AdvancedLazyLoader: React.FC<LazyLoaderProps> = memo(({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  delay = 0,
  fadeIn = true,
  priority = 'normal',
  preload = false
}) => {
  const [isVisible, setIsVisible] = useState(preload);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting && !isVisible) {
      if (delay > 0) {
        // Animation de progression pendant le délai
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + (100 / (delay / 50));
          });
        }, 50);

        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          clearInterval(progressInterval);
          setTimeout(() => setIsLoaded(true), 100);
        }, delay);
      } else {
        setIsVisible(true);
        setTimeout(() => setIsLoaded(true), 100);
      }
    }
  }, [isVisible, delay]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observerOptions = {
      threshold,
      rootMargin,
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high': return 'ring-2 ring-primary/30';
      case 'low': return 'opacity-75';
      default: return '';
    }
  };

  const DefaultFallback = () => (
    <motion.div 
      className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-background to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          {delay > 0 && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>Chargement intelligent...</span>
          <Zap className="h-4 w-4 text-yellow-500" />
        </div>
        {priority === 'high' && (
          <div className="text-xs text-primary font-medium">
            Priorité élevée
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div ref={elementRef} className={`lazy-loader ${getPriorityStyles()}`}>
      {isVisible ? (
        fadeIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isLoaded ? 1 : 0.7, 
              y: isLoaded ? 0 : 10 
            }}
            transition={{ 
              duration: 0.5, 
              ease: "easeOut",
              delay: isLoaded ? 0 : 0.1
            }}
            className="lazy-content"
          >
            {children}
          </motion.div>
        ) : (
          <div className="lazy-content">
            {children}
          </div>
        )
      ) : (
        fallback || <DefaultFallback />
      )}
    </div>
  );
});

AdvancedLazyLoader.displayName = 'AdvancedLazyLoader';

/**
 * Hook pour lazy loading conditionnel
 */
export const useLazyLoad = (condition: boolean, delay = 0) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (condition && !shouldLoad) {
      if (delay > 0) {
        const timeout = setTimeout(() => {
          setShouldLoad(true);
        }, delay);
        return () => clearTimeout(timeout);
      } else {
        setShouldLoad(true);
      }
    }
  }, [condition, delay, shouldLoad]);

  return shouldLoad;
};

/**
 * Component wrapper pour optimiser les images
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: 'low' | 'normal' | 'high';
  onLoad?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDIwTDIwIDIwWiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
  priority = 'normal',
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <img
        src={hasError ? placeholder : src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">
            Image indisponible
          </span>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';