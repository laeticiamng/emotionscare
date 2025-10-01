// @ts-nocheck

import React, { Suspense, lazy, ComponentType, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentLoaderProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  props?: any;
}

const defaultFallback = (
  <div className="space-y-3">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

const LazyComponentLoader: React.FC<LazyComponentLoaderProps> = ({
  importFunc,
  fallback = defaultFallback,
  errorFallback,
  props = {}
}) => {
  const LazyComponent = lazy(importFunc);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyComponentLoader;

// Hook pour le lazy loading conditionnel
export const useLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  shouldLoad: boolean = true
) => {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!shouldLoad || Component) return;

    setLoading(true);
    setError(null);

    importFunc()
      .then(module => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [shouldLoad, Component, importFunc]);

  return { Component, loading, error };
};

// Composant pour le preload des ressources critiques
export const ResourcePreloader: React.FC = () => {
  useEffect(() => {
    // Preload des fonts critiques
    const preloadFont = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = url;
      document.head.appendChild(link);
    };

    // Preload des images critiques
    const preloadImage = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    };

    // Preload des modules JavaScript critiques
    const preloadModule = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = url;
      document.head.appendChild(link);
    };

    // Preload conditionnel basé sur la connexion
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === '4g') {
        // Preload agressif pour les connexions rapides
        preloadImage('/hero/hero-fallback.webp');
        preloadModule('/src/components/coach/EnhancedCoachChat.tsx');
      }
    }
  }, []);

  return null;
};
