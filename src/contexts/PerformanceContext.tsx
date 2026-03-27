// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMemoryOptimization } from '@/hooks/optimization/useMemoryOptimization';
import { logger } from '@/lib/logger';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint  
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  isOptimized: boolean;
  optimizationLevel: 'low' | 'medium' | 'high';
  enableOptimizations: () => void;
  disableOptimizations: () => void;
  setOptimizationLevel: (level: 'low' | 'medium' | 'high') => void;
  measurePerformance: () => Promise<void>;
  resetMetrics: () => void;
}

const defaultMetrics: PerformanceMetrics = {
  fcp: 0,
  lcp: 0,
  cls: 0,
  fid: 0,
  renderTime: 0,
  memoryUsage: 0,
  bundleSize: 0,
  cacheHitRate: 0
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(defaultMetrics);
  const [isOptimized, setIsOptimized] = useState(true);
  const [optimizationLevel, setOptimizationLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  const memoryOptimization = useMemoryOptimization({
    maxCacheSize: optimizationLevel === 'high' ? 100 : optimizationLevel === 'medium' ? 50 : 25,
    memoryThreshold: optimizationLevel === 'high' ? 150 : optimizationLevel === 'medium' ? 100 : 75
  });
  
  // Mesure des performances Web Vitals
  const measureWebVitals = useCallback(async () => {
    if (typeof window === 'undefined' || !window.performance) return;
    
    return new Promise<PerformanceMetrics>((resolve) => {
      const newMetrics: Partial<PerformanceMetrics> = {};
      let observersCompleted = 0;
      const totalObservers = 3; // FCP, LCP, CLS
      
      const checkComplete = () => {
        observersCompleted++;
        if (observersCompleted >= totalObservers) {
          resolve({
            ...defaultMetrics,
            ...newMetrics,
            memoryUsage: getMemoryUsage(),
            renderTime: getAverageRenderTime()
          });
        }
      };
      
      // First Contentful Paint
      try {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          newMetrics.fcp = fcpEntry.startTime;
        }
      } catch (e) {
        logger.warn('FCP measurement failed', e as Error, 'SYSTEM');
      } finally {
        checkComplete();
      }
      
      // Largest Contentful Paint
      if (typeof PerformanceObserver !== 'undefined') {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              newMetrics.lcp = lastEntry.startTime;
            }
            lcpObserver.disconnect();
            checkComplete();
          });
          
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Timeout de sécurité
          setTimeout(() => {
            lcpObserver.disconnect();
            checkComplete();
          }, 3000);
        } catch (e) {
          logger.warn('LCP observer failed', e as Error, 'SYSTEM');
          checkComplete();
        }
        
        // Cumulative Layout Shift
        try {
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            list.getEntries().forEach((entry: any) => {
              if (entry.hadRecentInput) return;
              clsValue += entry.value;
            });
            newMetrics.cls = clsValue;
          });
          
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => {
            clsObserver.disconnect();
            checkComplete();
          }, 3000);
        } catch (e) {
          logger.warn('CLS observer failed', e as Error, 'SYSTEM');
          checkComplete();
        }
      } else {
        checkComplete(); // LCP
        checkComplete(); // CLS
      }
    });
  }, []);
  
  // Calculer l'utilisation mémoire
  const getMemoryUsage = useCallback((): number => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
    }
    return 0;
  }, []);
  
  // Calculer le temps de rendu moyen
  const getAverageRenderTime = useCallback((): number => {
    const entries = performance.getEntriesByType('measure');
    if (entries.length === 0) return 0;
    
    const renderEntries = entries.filter(entry => entry.name.includes('render'));
    if (renderEntries.length === 0) return 0;
    
    const total = renderEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round(total / renderEntries.length);
  }, []);
  
  // Mesurer les performances
  const measurePerformance = useCallback(async () => {
    try {
      const newMetrics = await measureWebVitals();
      setMetrics(prev => ({
        ...prev,
        ...newMetrics,
        cacheHitRate: Math.min(100, (memoryOptimization.getCacheSize() / 50) * 100)
      }));
    } catch (error) {
      logger.error('Performance measurement failed', error as Error, 'SYSTEM');
    }
  }, [measureWebVitals, memoryOptimization]);
  
  // Fonctions de contrôle
  const enableOptimizations = useCallback(() => {
    setIsOptimized(true);
    
    // Appliquer les optimisations selon le niveau
    if (optimizationLevel === 'high') {
      // Optimisations agressives
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    } else if (optimizationLevel === 'medium') {
      // Optimisations équilibrées
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    } else {
      // Optimisations légères
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
  }, [optimizationLevel]);
  
  const disableOptimizations = useCallback(() => {
    setIsOptimized(false);
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
  }, []);
  
  const resetMetrics = useCallback(() => {
    setMetrics(defaultMetrics);
  }, []);
  
  // Mesure initiale des performances
  useEffect(() => {
    const timer = setTimeout(() => {
      measurePerformance();
    }, 1000); // Attendre que la page soit chargée
    
    return () => clearTimeout(timer);
  }, [measurePerformance]);
  
  // Mesures périodiques
  useEffect(() => {
    if (!isOptimized) return;
    
    const interval = setInterval(() => {
      measurePerformance();
    }, 30000); // Toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [isOptimized, measurePerformance]);
  
  // Application des optimisations au changement de niveau
  useEffect(() => {
    if (isOptimized) {
      enableOptimizations();
    }
  }, [optimizationLevel, isOptimized, enableOptimizations]);
  
  const value: PerformanceContextType = {
    metrics,
    isOptimized,
    optimizationLevel,
    enableOptimizations,
    disableOptimizations,
    setOptimizationLevel,
    measurePerformance,
    resetMetrics
  };
  
  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};