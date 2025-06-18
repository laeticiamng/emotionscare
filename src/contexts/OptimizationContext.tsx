
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { performanceOptimizer } from '@/lib/performance/performanceOptimizer';
import { globalCache } from '@/lib/cache/cacheManager';

interface OptimizationContextType {
  isOptimized: boolean;
  performanceScore: number;
  cacheStats: any;
  enableOptimizations: () => void;
  disableOptimizations: () => void;
  clearCache: () => void;
}

const OptimizationContext = createContext<OptimizationContextType | null>(null);

interface OptimizationProviderProps {
  children: ReactNode;
}

export const OptimizationProvider: React.FC<OptimizationProviderProps> = ({ children }) => {
  const [isOptimized, setIsOptimized] = useState(true);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [cacheStats, setCacheStats] = useState({});

  useEffect(() => {
    // Calculer le score de performance initial
    const calculatePerformanceScore = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!navigation) return 0;

      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const domTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      // Score basé sur les temps de chargement (100 = parfait, 0 = très lent)
      const loadScore = Math.max(0, 100 - (loadTime / 50)); // 5s = score 0
      const domScore = Math.max(0, 100 - (domTime / 20)); // 2s = score 0
      
      return Math.round((loadScore + domScore) / 2);
    };

    // Mettre à jour les statistiques périodiquement
    const updateStats = () => {
      setPerformanceScore(calculatePerformanceScore());
      setCacheStats(globalCache.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  const enableOptimizations = () => {
    setIsOptimized(true);
    console.log('🚀 Optimizations enabled');
  };

  const disableOptimizations = () => {
    setIsOptimized(false);
    console.log('⏸️ Optimizations disabled');
  };

  const clearCache = () => {
    globalCache.clearAll();
    console.log('🗑️ Cache cleared');
  };

  const value: OptimizationContextType = {
    isOptimized,
    performanceScore,
    cacheStats,
    enableOptimizations,
    disableOptimizations,
    clearCache
  };

  return (
    <OptimizationContext.Provider value={value}>
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimization must be used within an OptimizationProvider');
  }
  return context;
};
