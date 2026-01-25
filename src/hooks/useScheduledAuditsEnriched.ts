/**
 * useScheduledAuditsEnriched - Cycle complet audit GDPR avec exécution, rapports, analytics
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { logger } from '@/lib/logger';

export interface AuditSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  day_of_week: number;
  day_of_month: number;
  time_of_day: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  alert_threshold: number;
  alert_recipients: string[];
  created_at: string;
  created_by: string | null;
}

export interface AuditAlert {
  id: string;
  schedule_id: string;
  audit_id: string;
  alert_type: 'score_drop' | 'threshold_breach' | 'critical_issue' | 'compliance_warning';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  previous_score: number | null;
  current_score: number | null;
  score_drop: number | null;
  is_sent: boolean;
  is_read: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
}

export interface AuditExecution {
  id: string;
  schedule_id: string;
  started_at: string;
  completed_at: string | null;
  status: 'running' | 'completed' | 'failed';
  score: number | null;
  issues_found: number;
  critical_issues: number;
  execution_time_ms: number | null;
  error_message: string | null;
}

export interface AuditReport {
  id: string;
  execution_id: string;
  generated_at: string;
  report_type: 'summary' | 'detailed' | 'compliance';
  format: 'json' | 'pdf' | 'html';
  download_url: string | null;
  expires_at: string | null;
}

export interface AuditStats {
  totalSchedules: number;
  activeSchedules: number;
  totalExecutions: number;
  avgScore: number;
  scoresTrend: { date: string; score: number }[];
  alertsCount: { total: number; unread: number; critical: number };
  complianceRate: number;
  lastExecutionDate: string | null;
  issuesByCategory: { category: string; count: number }[];
}

const _STORAGE_KEY = 'scheduled-audits-local';

export const useScheduledAuditsEnriched = () => {
  const queryClient = useQueryClient();
  const [executionProgress, setExecutionProgress] = useState<Record<string, number>>({});

  // Récupérer les schedules
  const { data: schedules = [], isLoading: schedulesLoading, refetch: refetchSchedules } = useQuery({
    queryKey: ['audit-schedules-enriched'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AuditSchedule[];
    },
    staleTime: 30000,
  });

  // Récupérer les alertes avec plus de détails
  const { data: alerts = [], isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ['audit-alerts-enriched'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []).map(alert => ({
        ...alert,
        is_read: alert.is_sent, // Legacy compatibility
        acknowledged_at: null,
        acknowledged_by: null
      })) as AuditAlert[];
    },
    refetchInterval: 30000,
  });

  // Récupérer les exécutions récentes
  const { data: executions = [], isLoading: executionsLoading } = useQuery({
    queryKey: ['audit-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map(exec => ({
        id: exec.id,
        schedule_id: exec.schedule_id || '',
        started_at: exec.created_at,
        completed_at: exec.completed_at,
        status: exec.status as 'running' | 'completed' | 'failed',
        score: exec.overall_score,
        issues_found: exec.total_issues || 0,
        critical_issues: exec.critical_issues || 0,
        execution_time_ms: exec.execution_time_ms,
        error_message: null
      })) as AuditExecution[];
    },
  });

  // Créer un schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<AuditSchedule, 'id' | 'created_at' | 'last_run_at' | 'next_run_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculer next_run_at
      const nextRun = calculateNextRun(schedule);

      const { data, error } = await supabase
        .from('audit_schedules')
        .insert({
          ...schedule,
          created_by: user.id,
          next_run_at: nextRun
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules-enriched'] });
      toast.success('Planification créée avec succès');
      logger.info('Audit schedule created', {}, 'GDPR');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
      logger.error('Failed to create audit schedule', error, 'GDPR');
    },
  });

  // Mettre à jour un schedule
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, ...schedule }: Partial<AuditSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('audit_schedules')
        .update({
          ...schedule,
          next_run_at: schedule.frequency ? calculateNextRun(schedule as AuditSchedule) : undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules-enriched'] });
      toast.success('Planification mise à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Supprimer un schedule
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audit_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules-enriched'] });
      toast.success('Planification supprimée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Exécuter un audit manuellement
  const executeAuditMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      setExecutionProgress(prev => ({ ...prev, [scheduleId]: 0 }));

      // Simuler la progression
      const progressInterval = setInterval(() => {
        setExecutionProgress(prev => ({
          ...prev,
          [scheduleId]: Math.min((prev[scheduleId] || 0) + 10, 90)
        }));
      }, 500);

      try {
        const { data, error } = await supabase.functions.invoke('run-compliance-audit', {
          body: { scheduleId }
        });

        clearInterval(progressInterval);
        setExecutionProgress(prev => ({ ...prev, [scheduleId]: 100 }));

        if (error) throw error;
        return data;
      } catch (err) {
        clearInterval(progressInterval);
        setExecutionProgress(prev => ({ ...prev, [scheduleId]: -1 }));
        throw err;
      } finally {
        setTimeout(() => {
          setExecutionProgress(prev => {
            const updated = { ...prev };
            delete updated[scheduleId];
            return updated;
          });
        }, 2000);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules-enriched'] });
      queryClient.invalidateQueries({ queryKey: ['audit-executions'] });
      toast.success(`Audit terminé - Score: ${data?.score || 'N/A'}%`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur d'exécution: ${error.message}`);
    },
  });

  // Marquer une alerte comme lue
  const markAlertReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audit_alerts')
        .update({ is_sent: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-alerts-enriched'] });
    },
  });

  // Marquer toutes les alertes comme lues
  const markAllAlertsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('audit_alerts')
        .update({ is_sent: true })
        .eq('is_sent', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-alerts-enriched'] });
      toast.success('Toutes les alertes marquées comme lues');
    },
  });

  // Acquitter une alerte
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async ({ id, notes: _notes }: { id: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('audit_alerts')
        .update({
          is_sent: true,
          // acknowledged_at et acknowledged_by pourraient être ajoutés à la table
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-alerts-enriched'] });
      toast.success('Alerte acquittée');
    },
  });

  // Générer un rapport
  const generateReportMutation = useMutation({
    mutationFn: async ({ executionId, format }: { executionId: string; format: 'json' | 'pdf' | 'html' }) => {
      const { data, error } = await supabase.functions.invoke('generate-audit-report', {
        body: { executionId, format }
      });

      if (error) throw error;
      return data as AuditReport;
    },
    onSuccess: (data) => {
      if (data.download_url) {
        window.open(data.download_url, '_blank');
      }
      toast.success('Rapport généré');
    },
    onError: (error: Error) => {
      toast.error(`Erreur génération rapport: ${error.message}`);
    },
  });

  // Calculer les statistiques
  const getStats = useCallback((): AuditStats => {
    const scores = executions
      .filter(e => e.score !== null)
      .map(e => ({ date: e.started_at, score: e.score! }));

    const avgScore = scores.length > 0
      ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
      : 0;

    const unreadAlerts = alerts.filter(a => !a.is_read).length;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

    const issuesByCategory: Record<string, number> = {};
    alerts.forEach(alert => {
      issuesByCategory[alert.alert_type] = (issuesByCategory[alert.alert_type] || 0) + 1;
    });

    return {
      totalSchedules: schedules.length,
      activeSchedules: schedules.filter(s => s.is_active).length,
      totalExecutions: executions.length,
      avgScore: Math.round(avgScore),
      scoresTrend: scores.slice(0, 30),
      alertsCount: {
        total: alerts.length,
        unread: unreadAlerts,
        critical: criticalAlerts
      },
      complianceRate: avgScore >= 80 ? avgScore : avgScore * 0.9,
      lastExecutionDate: executions[0]?.started_at || null,
      issuesByCategory: Object.entries(issuesByCategory).map(([category, count]) => ({ category, count }))
    };
  }, [schedules, alerts, executions]);

  // Export des données
  const exportAuditData = useCallback((format: 'json' | 'csv' = 'json'): string => {
    const data = {
      schedules,
      alerts: alerts.slice(0, 100),
      executions: executions.slice(0, 50),
      stats: getStats(),
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      // Export CSV simplifié des exécutions
      const headers = 'ID,Schedule ID,Started At,Status,Score,Issues Found,Critical Issues\n';
      const rows = executions.map(e =>
        `${e.id},${e.schedule_id},${e.started_at},${e.status},${e.score || 'N/A'},${e.issues_found},${e.critical_issues}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify(data, null, 2);
  }, [schedules, alerts, executions, getStats]);

  // Toggle activation d'un schedule
  const toggleScheduleActive = useCallback(async (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;

    await updateScheduleMutation.mutateAsync({
      id,
      is_active: !schedule.is_active
    });
  }, [schedules, updateScheduleMutation]);

  return {
    // Data
    schedules,
    alerts,
    executions,
    isLoading: schedulesLoading || alertsLoading || executionsLoading,

    // Refetch
    refetchSchedules,
    refetchAlerts,

    // Schedule CRUD
    createSchedule: createScheduleMutation.mutateAsync,
    updateSchedule: updateScheduleMutation.mutateAsync,
    deleteSchedule: deleteScheduleMutation.mutateAsync,
    toggleScheduleActive,

    // Execution
    executeAudit: executeAuditMutation.mutateAsync,
    executionProgress,
    isExecuting: executeAuditMutation.isPending,

    // Alerts
    markAlertRead: markAlertReadMutation.mutateAsync,
    markAllAlertsRead: markAllAlertsReadMutation.mutateAsync,
    acknowledgeAlert: acknowledgeAlertMutation.mutateAsync,
    unreadAlertsCount: alerts.filter(a => !a.is_read).length,

    // Reports
    generateReport: generateReportMutation.mutateAsync,
    isGeneratingReport: generateReportMutation.isPending,

    // Stats & Export
    getStats,
    exportAuditData,

    // Loading states
    isUpdating: createScheduleMutation.isPending || updateScheduleMutation.isPending || deleteScheduleMutation.isPending,
  };
};

// Helper: Calculer la prochaine exécution
function calculateNextRun(schedule: Partial<AuditSchedule>): string {
  const now = new Date();
  const [hours, minutes] = (schedule.time_of_day || '00:00').split(':').map(Number);

  let next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  switch (schedule.frequency) {
    case 'daily':
      if (next <= now) next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      const targetDay = schedule.day_of_week || 1;
      while (next.getDay() !== targetDay || next <= now) {
        next.setDate(next.getDate() + 1);
      }
      break;
    case 'monthly':
      next.setDate(schedule.day_of_month || 1);
      if (next <= now) next.setMonth(next.getMonth() + 1);
      break;
    default:
      next.setDate(next.getDate() + 1);
  }

  return next.toISOString();
}

export default useScheduledAuditsEnriched;
