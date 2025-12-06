// @ts-nocheck
/**
 * Hook pour le monitoring des APIs
 * Fournit un état en temps réel de toutes les APIs critiques
 */

import { useState, useEffect, useCallback } from 'react';
import { apiMonitoringService, ApiMonitoringReport } from '@/services/apiMonitoring';
import { toast } from '@/hooks/use-toast';

interface UseApiMonitoringOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // en millisecondes
  onStatusChange?: (report: ApiMonitoringReport) => void;
}

export const useApiMonitoring = (options: UseApiMonitoringOptions = {}) => {
  const {
    autoRefresh = true,
    refreshInterval = 60000, // 1 minute par défaut
    onStatusChange
  } = options;

  const [report, setReport] = useState<ApiMonitoringReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Exécute le monitoring complet
   */
  const runMonitoring = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newReport = await apiMonitoringService.runFullMonitoring();
      setReport(newReport);
      setLastUpdate(new Date());
      
      // Callback personnalisé
      if (onStatusChange) {
        onStatusChange(newReport);
      }

      // Notification si des APIs sont en panne
      if (newReport.overallStatus === 'critical') {
        toast({
          title: "APIs critiques en panne",
          description: `${newReport.summary.failed} APIs ne répondent pas correctement.`,
          variant: "destructive",
        });
      } else if (newReport.overallStatus === 'degraded') {
        toast({
          title: "Performances dégradées",
          description: `${newReport.summary.failed} APIs rencontrent des problèmes.`,
          variant: "destructive",
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de monitoring';
      setError(errorMessage);
      toast({
        title: "Erreur de monitoring",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onStatusChange]);

  /**
   * Test rapide des APIs critiques
   */
  const quickCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiMonitoringService.runQuickCheck();
      
      if (result.status === 'issues') {
        toast({
          title: "APIs critiques en panne",
          description: `Problème détecté avec: ${result.criticalApis.join(', ')}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "APIs fonctionnelles",
          description: "Toutes les APIs critiques répondent correctement.",
          variant: "default",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de vérification rapide';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh manuel
   */
  const refresh = useCallback(() => {
    runMonitoring();
  }, [runMonitoring]);

  // Monitoring automatique au montage et à intervalle régulier
  useEffect(() => {
    // Premier check au montage
    runMonitoring();

    // Auto-refresh si activé
    if (autoRefresh) {
      const interval = setInterval(runMonitoring, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [runMonitoring, autoRefresh, refreshInterval]);

  // Valeurs dérivées pour faciliter l'utilisation
  const isHealthy = report?.overallStatus === 'healthy';
  const isDegraded = report?.overallStatus === 'degraded';
  const isCritical = report?.overallStatus === 'critical';
  
  const healthyCount = report?.summary.healthy || 0;
  const failedCount = report?.summary.failed || 0;
  const totalCount = report?.summary.total || 0;
  
  const averageResponseTime = report?.summary.averageResponseTime || 0;

  // APIs par statut
  const healthyApis = report?.apis.filter(api => api.isConnected) || [];
  const failedApis = report?.apis.filter(api => !api.isConnected) || [];

  return {
    // État principal
    report,
    isLoading,
    error,
    lastUpdate,

    // Actions
    refresh,
    quickCheck,
    runMonitoring,

    // Valeurs dérivées
    isHealthy,
    isDegraded, 
    isCritical,
    healthyCount,
    failedCount,
    totalCount,
    averageResponseTime,

    // APIs par statut
    healthyApis,
    failedApis,

    // Helpers
    getApiStatus: (apiName: string) => {
      return report?.apis.find(api => api.name === apiName);
    },
    
    isApiHealthy: (apiName: string) => {
      const api = report?.apis.find(api => api.name === apiName);
      return api?.isConnected || false;
    }
  };
};