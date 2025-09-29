
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { cacheManager } from '@/utils/cacheManager';
import { measureWebVitals, preloadCriticalResources } from '@/utils/performanceOptimizer';

interface OptimizationContextType {
  performanceScore: number;
  cacheStats: any;
  webVitals: {[key: string]: number};
  optimizationsEnabled: boolean;
  toggleOptimizations: () => void;
  preloadResources: () => Promise<void>;
  clearCache: () => void;
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

export const OptimizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [performanceScore, setPerformanceScore] = useState(0);
  const [cacheStats, setCacheStats] = useState({});
  const [webVitals, setWebVitals] = useState<{[key: string]: number}>({});
  const [optimizationsEnabled, setOptimizationsEnabled] = useState(true);
  const performanceMetrics = usePerformanceMonitor();

  useEffect(() => {
    // Calculer le score de performance basé sur les métriques
    const calculateScore = () => {
      let score = 100;
      
      if (performanceMetrics.fcp && performanceMetrics.fcp > 1500) score -= 20;
      if (performanceMetrics.lcp && performanceMetrics.lcp > 2500) score -= 20;
      if (performanceMetrics.cls && performanceMetrics.cls > 0.1) score -= 20;
      if (performanceMetrics.fid && performanceMetrics.fid > 100) score -= 20;
      if (performanceMetrics.renderTime > 100) score -= 10;
      if (performanceMetrics.memoryUsage > 50) score -= 10;

      setPerformanceScore(Math.max(0, score));
    };

    calculateScore();
  }, [performanceMetrics]);

  useEffect(() => {
    // Mettre à jour les statistiques du cache périodiquement
    const updateCacheStats = () => {
      setCacheStats(cacheManager.getStats());
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Mesurer les Web Vitals
    measureWebVitals().then(setWebVitals);
  }, []);

  const toggleOptimizations = () => {
    setOptimizationsEnabled(!optimizationsEnabled);
  };

  const preloadResources = async () => {
    await preloadCriticalResources();
  };

  const clearCache = () => {
    cacheManager.clear();
    setCacheStats(cacheManager.getStats());
  };

  return (
    <OptimizationContext.Provider value={{
      performanceScore,
      cacheStats,
      webVitals,
      optimizationsEnabled,
      toggleOptimizations,
      preloadResources,
      clearCache
    }}>
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimization must be used within OptimizationProvider');
  }
  return context;
};
