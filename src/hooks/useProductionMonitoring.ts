
import { useState, useEffect } from 'react';
import { globalErrorService } from '@/lib/errorBoundary';
import { systemHealthMonitor } from '@/utils/systemHealth';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';

interface MonitoringMetrics {
  errorCount: number;
  performanceScore: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
  userCount: number;
  apiLatency: number;
  memoryUsage: number;
}

export const useProductionMonitoring = () => {
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    errorCount: 0,
    performanceScore: 100,
    healthStatus: 'healthy',
    userCount: 0,
    apiLatency: 0,
    memoryUsage: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(import.meta.env.PROD);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!isMonitoring) return;

    const updateMetrics = async () => {
      try {
        // Métriques d'erreurs
        const recentErrors = globalErrorService.getRecentErrors();
        
        // Métriques de santé système
        const healthChecks = await systemHealthMonitor.runHealthChecks();
        const healthStatus = systemHealthMonitor.getOverallStatus();
        
        // Métriques de performance
        const performanceScore = calculatePerformanceScore();
        
        // Métriques mémoire
        const memoryUsage = getMemoryUsage();
        
        setMetrics({
          errorCount: recentErrors.length,
          performanceScore,
          healthStatus,
          userCount: getActiveUserCount(),
          apiLatency: performanceMonitor.getAverageMetric('api_call'),
          memoryUsage
        });
        
        // Vérification des alertes
        checkForAlerts(healthStatus, recentErrors.length, performanceScore);
        
      } catch (error) {
        console.error('Error updating monitoring metrics:', error);
      }
    };

    // Mise à jour toutes les 30 secondes
    const interval = setInterval(updateMetrics, 30000);
    updateMetrics(); // Mise à jour initiale

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const calculatePerformanceScore = (): number => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return 100;

    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    const domTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    
    const loadScore = Math.max(0, 100 - (loadTime / 50));
    const domScore = Math.max(0, 100 - (domTime / 20));
    
    return Math.round((loadScore + domScore) / 2);
  };

  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return 0;
  };

  const getActiveUserCount = (): number => {
    // Simuler le nombre d'utilisateurs actifs
    return Math.floor(Math.random() * 50) + 10;
  };

  const checkForAlerts = (health: string, errorCount: number, perfScore: number) => {
    const newAlerts: string[] = [];
    
    if (health === 'critical') {
      newAlerts.push('Système en état critique');
    }
    if (errorCount > 5) {
      newAlerts.push(`Nombre d'erreurs élevé: ${errorCount}`);
    }
    if (perfScore < 60) {
      newAlerts.push(`Performance dégradée: ${perfScore}%`);
    }
    
    setAlerts(newAlerts);
    
    // Envoyer les alertes critiques
    if (newAlerts.length > 0) {
      sendAlerts(newAlerts);
    }
  };

  const sendAlerts = (alertList: string[]) => {
    if (import.meta.env.PROD) {
      // En production, envoyer vers service de monitoring
      console.warn('🚨 ALERTES PRODUCTION:', alertList);
    }
  };

  return {
    metrics,
    alerts,
    isMonitoring,
    setIsMonitoring
  };
};
