// @ts-nocheck
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface AccessAnomaly {
  id: string;
  user_id: string;
  accessed_by: string;
  anomaly_type: 'volume_spike' | 'unusual_time' | 'unusual_resource' | 'velocity' | 'geographic' | 'bulk_export';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  description: string;
  detected_at: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  false_positive: boolean;
  access_log_ids?: string[];
  context: any;
}

export interface DetectionRule {
  id: string;
  rule_name: string;
  rule_type: string;
  enabled: boolean;
  sensitivity: number;
  threshold_multiplier: number;
  parameters: any;
  created_at: string;
  updated_at: string;
}

export interface AnomalyStats {
  total: number;
  unresolved: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  recentTrend: 'increasing' | 'decreasing' | 'stable';
  avgConfidence: number;
}

export const useAnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState<AccessAnomaly[]>([]);
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [stats, setStats] = useState<AnomalyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  // Fetch anomalies
  const fetchAnomalies = useCallback(async (filters?: {
    resolved?: boolean;
    severity?: string;
    type?: string;
    limit?: number;
  }) => {
    try {
      let query = supabase
        .from('access_anomalies')
        .select('*')
        .order('detected_at', { ascending: false });

      if (filters?.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.type) {
        query = query.eq('anomaly_type', filters.type);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAnomalies(data || []);
    } catch (error) {
      logger.error('Error fetching anomalies', error as Error, 'ANOMALY');
    }
  }, []);

  // Fetch detection rules
  const fetchRules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('anomaly_detection_rules')
        .select('*')
        .order('rule_name', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      logger.error('Error fetching rules', error as Error, 'ANOMALY');
    }
  }, []);

  // Calculate statistics
  const calculateStats = useCallback(async () => {
    try {
      const { data: allAnomalies, error } = await supabase
        .from('access_anomalies')
        .select('severity, anomaly_type, confidence_score, detected_at, resolved');

      if (error) throw error;

      const bySeverity = (allAnomalies || []).reduce((acc, a) => {
        acc[a.severity] = (acc[a.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byType = (allAnomalies || []).reduce((acc, a) => {
        acc[a.anomaly_type] = (acc[a.anomaly_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const unresolved = (allAnomalies || []).filter(a => !a.resolved).length;

      // Calculate trend
      const last24h = (allAnomalies || []).filter(
        a => new Date(a.detected_at) > new Date(Date.now() - 86400000)
      ).length;
      const prev24h = (allAnomalies || []).filter(
        a => new Date(a.detected_at) > new Date(Date.now() - 172800000) &&
            new Date(a.detected_at) <= new Date(Date.now() - 86400000)
      ).length;

      let recentTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (last24h > prev24h * 1.2) recentTrend = 'increasing';
      else if (last24h < prev24h * 0.8) recentTrend = 'decreasing';

      const avgConfidence = (allAnomalies || []).reduce((sum, a) => sum + a.confidence_score, 0) / 
        ((allAnomalies || []).length || 1);

      setStats({
        total: (allAnomalies || []).length,
        unresolved,
        bySeverity,
        byType,
        recentTrend,
        avgConfidence,
      });
    } catch (error) {
      logger.error('Error calculating stats', error as Error, 'ANOMALY');
    }
  }, []);

  // Run anomaly detection
  const runDetection = useCallback(async (options?: {
    userId?: string;
    timeWindow?: string;
    mode?: 'realtime' | 'comprehensive';
  }) => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('anomaly-detector', {
        body: {
          userId: options?.userId,
          timeWindow: options?.timeWindow || '1 hour',
          mode: options?.mode || 'realtime',
        },
      });

      if (error) throw error;

      toast({
        title: 'Scan terminé',
        description: `${data?.anomaliesDetected || 0} anomalies détectées`,
      });

      await fetchAnomalies();
      await calculateStats();

      return data;
    } catch (error) {
      logger.error('Error running detection', error as Error, 'ANOMALY');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exécuter la détection',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  }, [fetchAnomalies, calculateStats, toast]);

  // Resolve anomaly
  const resolveAnomaly = useCallback(async (
    anomalyId: string,
    markAsFalsePositive: boolean = false
  ) => {
    try {
      const { error } = await supabase
        .from('access_anomalies')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
          false_positive: markAsFalsePositive,
        })
        .eq('id', anomalyId);

      if (error) throw error;

      toast({
        title: 'Anomalie résolue',
        description: markAsFalsePositive ? 'Marquée comme faux positif' : 'Marquée comme résolue',
      });

      await fetchAnomalies();
      await calculateStats();
    } catch (error) {
      logger.error('Error resolving anomaly', error as Error, 'ANOMALY');
      toast({
        title: 'Erreur',
        description: 'Impossible de résoudre l\'anomalie',
        variant: 'destructive',
      });
    }
  }, [fetchAnomalies, calculateStats, toast]);

  // Update detection rule
  const updateRule = useCallback(async (
    ruleId: string,
    updates: Partial<DetectionRule>
  ) => {
    try {
      const { error } = await supabase
        .from('anomaly_detection_rules')
        .update(updates)
        .eq('id', ruleId);

      if (error) throw error;

      toast({
        title: 'Règle mise à jour',
        description: 'La règle de détection a été modifiée',
      });

      await fetchRules();
    } catch (error) {
      logger.error('Error updating rule', error as Error, 'ANOMALY');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la règle',
        variant: 'destructive',
      });
    }
  }, [fetchRules, toast]);

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchAnomalies({ resolved: false }),
        fetchRules(),
        calculateStats(),
      ]);
      setLoading(false);
    };

    loadAll();
  }, [fetchAnomalies, fetchRules, calculateStats]);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('anomaly-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'access_anomalies' }, () => {
        fetchAnomalies({ resolved: false });
        calculateStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'anomaly_detection_rules' }, fetchRules)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAnomalies, fetchRules, calculateStats]);

  // Auto-scan every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      runDetection({ mode: 'realtime' });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [runDetection]);

  return {
    anomalies,
    rules,
    stats,
    loading,
    isScanning,
    runDetection,
    resolveAnomaly,
    updateRule,
    fetchAnomalies,
  };
};
