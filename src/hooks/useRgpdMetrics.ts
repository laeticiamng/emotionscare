// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RgpdMetric {
  function_name: string;
  error_count: number;
  total_calls: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  timestamp: string;
}

/**
 * Hook pour récupérer les métriques des Edge Functions RGPD
 */
export const useRgpdMetrics = (refreshInterval = 30000) => {
  return useQuery({
    queryKey: ['rgpd-metrics'],
    queryFn: async () => {
      // Récupérer les métriques depuis la table monitoring_metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('monitoring_metrics')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(1000);

      if (metricsError) throw metricsError;

      // Récupérer les alertes critiques
      const { count: criticalAlertsCount } = await supabase
        .from('gdpr_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical')
        .is('resolved_at', null);

      // Récupérer les violations récentes
      const { count: violationsCount } = await supabase
        .from('gdpr_violations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'detected')
        .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      return {
        metrics: metricsData || [],
        criticalAlerts: criticalAlertsCount || 0,
        violations: violationsCount || 0,
      };
    },
    refetchInterval: refreshInterval,
    staleTime: 10000,
  });
};

/**
 * Hook pour récupérer l'historique des métriques
 */
export const useRgpdMetricsHistory = (functionName: string, days = 7) => {
  return useQuery({
    queryKey: ['rgpd-metrics-history', functionName, days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('monitoring_metrics')
        .select('*')
        .eq('metric_name', `function_${functionName}`)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;

      return data || [];
    },
    staleTime: 60000, // 1 minute
  });
};

/**
 * Calculer les statistiques agrégées
 */
export const calculateFunctionStats = (metrics: any[]) => {
  if (!metrics.length) {
    return {
      errorRate: 0,
      avgLatency: 0,
      p95Latency: 0,
      p99Latency: 0,
      totalCalls: 0,
    };
  }

  const latencies = metrics
    .map((m) => m.metric_value)
    .filter((v) => v !== null && v !== undefined)
    .sort((a, b) => a - b);

  const totalCalls = metrics.length;
  const errorCount = metrics.filter((m) => m.is_anomaly).length;
  const errorRate = (errorCount / totalCalls) * 100;

  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;
  
  const p95Index = Math.floor(latencies.length * 0.95);
  const p99Index = Math.floor(latencies.length * 0.99);
  
  const p95Latency = latencies[p95Index] || 0;
  const p99Latency = latencies[p99Index] || 0;

  return {
    errorRate,
    avgLatency,
    p95Latency,
    p99Latency,
    totalCalls,
  };
};
