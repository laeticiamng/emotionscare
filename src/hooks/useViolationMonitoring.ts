// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface GDPRViolation {
  id: string;
  violation_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_data_types: string[];
  affected_users_count: number;
  detected_at: string;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  risk_score: number;
  ml_confidence: number;
  metadata: any;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

export interface ViolationAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  risk_indicators: any;
  recommendations: string[];
  predicted_impact: string;
  confidence_score: number;
  is_read: boolean;
  is_dismissed: boolean;
  triggered_at: string;
  expires_at?: string;
}

export interface MonitoringMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  threshold_value?: number;
  is_anomaly: boolean;
  recorded_at: string;
  metadata: any;
}

export interface ViolationStats {
  total_violations: number;
  critical_violations: number;
  high_violations: number;
  resolved_violations: number;
  avg_resolution_time?: string;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
}

export const useViolationMonitoring = () => {
  const [violations, setViolations] = useState<GDPRViolation[]>([]);
  const [alerts, setAlerts] = useState<ViolationAlert[]>([]);
  const [metrics, setMetrics] = useState<MonitoringMetric[]>([]);
  const [stats, setStats] = useState<ViolationStats | null>(null);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Charger les violations
  const loadViolations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gdpr_violations')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setViolations(data || []);
    } catch (error) {
      logger.error('Error loading violations', { error }, 'GDPR');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les violations',
        variant: 'destructive',
      });
    }
  }, []);

  // Charger les alertes
  const loadAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('violation_alerts')
        .select('*')
        .eq('is_dismissed', false)
        .order('triggered_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      logger.error('Error loading alerts', { error }, 'GDPR');
    }
  }, []);

  // Charger les métriques
  const loadMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('monitoring_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      logger.error('Error loading metrics', { error }, 'GDPR');
    }
  }, []);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_violation_stats', { days: 30 });

      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      logger.error('Error loading stats', { error }, 'GDPR');
    }
  }, []);

  // Calculer le score de risque
  const loadRiskScore = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_risk_score');

      if (error) throw error;
      setRiskScore(data || 0);
    } catch (error) {
      logger.error('Error calculating risk score', { error }, 'GDPR');
    }
  }, []);

  // Lancer une détection ML
  const runDetection = useCallback(async (action: 'analyze' | 'scan' | 'predict' = 'scan') => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('violation-detector', {
        body: { action, context: {} },
      });

      if (error) throw error;

      toast({
        title: 'Analyse terminée',
        description: `${data.violations?.length || 0} violations détectées, ${data.alerts?.length || 0} alertes créées`,
        variant: data.violations?.length > 0 ? 'destructive' : 'default',
      });

      // Recharger les données
      await Promise.all([
        loadViolations(),
        loadAlerts(),
        loadMetrics(),
        loadStats(),
        loadRiskScore(),
      ]);

      return data;
    } catch (error) {
      logger.error('Error running detection', { error }, 'GDPR');
      toast({
        title: 'Erreur de détection',
        description: error.message || 'Impossible d\'exécuter la détection',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsScanning(false);
    }
  }, [loadViolations, loadAlerts, loadMetrics, loadStats, loadRiskScore]);

  // Mettre à jour le statut d'une violation
  const updateViolationStatus = useCallback(async (
    violationId: string,
    status: GDPRViolation['status'],
    resolutionNotes?: string
  ) => {
    try {
      const updates: any = { status };
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
        updates.resolution_notes = resolutionNotes || '';
      }

      const { error } = await supabase
        .from('gdpr_violations')
        .update(updates)
        .eq('id', violationId);

      if (error) throw error;

      toast({
        title: 'Violation mise à jour',
        description: `Statut changé en ${status}`,
      });

      await loadViolations();
      await loadRiskScore();
    } catch (error) {
      logger.error('Error updating violation', { error }, 'GDPR');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la violation',
        variant: 'destructive',
      });
    }
  }, [loadViolations, loadRiskScore]);

  // Marquer une alerte comme lue
  const markAlertAsRead = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('violation_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      await loadAlerts();
    } catch (error) {
      logger.error('Error marking alert as read', { error }, 'GDPR');
    }
  }, [loadAlerts]);

  // Rejeter une alerte
  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('violation_alerts')
        .update({ is_dismissed: true })
        .eq('id', alertId);

      if (error) throw error;
      await loadAlerts();
    } catch (error) {
      logger.error('Error dismissing alert', { error }, 'GDPR');
    }
  }, [loadAlerts]);

  // Charger toutes les données
  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadViolations(),
        loadAlerts(),
        loadMetrics(),
        loadStats(),
        loadRiskScore(),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [loadViolations, loadAlerts, loadMetrics, loadStats, loadRiskScore]);

  // Setup des subscriptions en temps réel
  useEffect(() => {
    loadAll();

    // Subscription pour les violations
    const violationsChannel = supabase
      .channel('violations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gdpr_violations' },
        (payload) => {
          logger.info('Violation change detected', { payload }, 'GDPR');
          loadViolations();
          loadRiskScore();
          
          if (payload.eventType === 'INSERT') {
            const newViolation = payload.new as GDPRViolation;
            if (newViolation.severity === 'critical' || newViolation.severity === 'high') {
              toast({
                title: '⚠️ Nouvelle violation détectée',
                description: newViolation.title,
                variant: 'destructive',
              });
            }
          }
        }
      )
      .subscribe();

    // Subscription pour les alertes
    const alertsChannel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'violation_alerts' },
        (payload) => {
          logger.info('New alert detected', { payload }, 'GDPR');
          loadAlerts();
          
          const newAlert = payload.new as ViolationAlert;
          if (newAlert.severity === 'critical' || newAlert.severity === 'warning') {
            toast({
              title: '🚨 Alerte proactive',
              description: newAlert.title,
              variant: newAlert.severity === 'critical' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(violationsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [loadAll, loadViolations, loadAlerts, loadRiskScore]);

  return {
    violations,
    alerts,
    metrics,
    stats,
    riskScore,
    isLoading,
    isScanning,
    runDetection,
    updateViolationStatus,
    markAlertAsRead,
    dismissAlert,
    refresh: loadAll,
  };
};
