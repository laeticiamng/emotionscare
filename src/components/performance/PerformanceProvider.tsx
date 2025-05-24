
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface PerformanceContextType {
  isSlowDevice: boolean;
  shouldReduceAnimations: boolean;
  shouldLazyLoad: boolean;
  connectionType: string;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const metrics = usePerformanceMonitor('App');
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceContextType>({
    isSlowDevice: false,
    shouldReduceAnimations: false,
    shouldLazyLoad: true,
    connectionType: 'unknown'
  });

  useEffect(() => {
    // Détecter les appareils lents
    const isSlowDevice = metrics ? 
      metrics.renderTime > 200 || 
      (metrics.memoryUsage && metrics.memoryUsage > 100 * 1024 * 1024) : // > 100MB
      false;

    // Détecter la connexion
    const connection = (navigator as any).connection;
    const connectionType = connection?.effectiveType || 'unknown';
    const isSlowConnection = connection ? 
      ['slow-2g', '2g'].includes(connection.effectiveType) : 
      false;

    // Détecter les préférences utilisateur
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setPerformanceSettings({
      isSlowDevice,
      shouldReduceAnimations: isSlowDevice || isSlowConnection || prefersReducedMotion,
      shouldLazyLoad: isSlowDevice || isSlowConnection,
      connectionType
    });
  }, [metrics]);

  return (
    <PerformanceContext.Provider value={performanceSettings}>
      {children}
    </PerformanceContext.Provider>
  );
};
