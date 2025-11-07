import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface GDPRAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string | null;
  metadata: any;
  user_id: string | null;
  resolved: boolean;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

interface AlertFilters {
  startDate?: string;
  endDate?: string;
  severity?: string;
  alertType?: string;
}

interface AlertStatistics {
  totalResolved: number;
  averageResolutionTime: number; // en heures
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  resolutionTimesBySeverity: Record<string, number>;
}

/**
 * Hook pour gérer l'historique des alertes RGPD résolues
 */
export const useGDPRAlertHistory = (filters: AlertFilters = {}) => {
  const [alerts, setAlerts] = useState<GDPRAlert[]>([]);
  const [statistics, setStatistics] = useState<AlertStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlertHistory = async () => {
    try {
      setIsLoading(true);

      // Construire la requête avec filtres
      let query = supabase
        .from('gdpr_alerts')
        .select('*')
        .eq('resolved', true)
        .order('resolved_at', { ascending: false });

      // Appliquer les filtres
      if (filters.startDate) {
        query = query.gte('resolved_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('resolved_at', filters.endDate);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.alertType) {
        query = query.eq('alert_type', filters.alertType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAlerts(data || []);

      // Calculer les statistiques
      if (data && data.length > 0) {
        const stats = calculateStatistics(data);
        setStatistics(stats);
      } else {
        setStatistics({
          totalResolved: 0,
          averageResolutionTime: 0,
          bySeverity: {},
          byType: {},
          resolutionTimesBySeverity: {},
        });
      }

      logger.debug(`Loaded ${data?.length || 0} resolved GDPR alerts`, undefined, 'GDPR');
    } catch (error) {
      logger.error('Error fetching GDPR alert history', error as Error, 'GDPR');
      setAlerts([]);
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertHistory();
  }, [filters.startDate, filters.endDate, filters.severity, filters.alertType]);

  return {
    alerts,
    statistics,
    isLoading,
    refetch: fetchAlertHistory,
  };
};

/**
 * Calculer les statistiques de résolution des alertes
 */
function calculateStatistics(alerts: GDPRAlert[]): AlertStatistics {
  const totalResolved = alerts.length;
  const bySeverity: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const resolutionTimes: number[] = [];
  const resolutionTimesBySeverity: Record<string, number[]> = {
    info: [],
    warning: [],
    critical: [],
  };

  alerts.forEach((alert) => {
    // Compter par sévérité
    bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;

    // Compter par type
    byType[alert.alert_type] = (byType[alert.alert_type] || 0) + 1;

    // Calculer le temps de résolution
    if (alert.resolved_at && alert.created_at) {
      const createdAt = new Date(alert.created_at).getTime();
      const resolvedAt = new Date(alert.resolved_at).getTime();
      const resolutionTimeHours = (resolvedAt - createdAt) / (1000 * 60 * 60);
      
      resolutionTimes.push(resolutionTimeHours);
      resolutionTimesBySeverity[alert.severity].push(resolutionTimeHours);
    }
  });

  // Calculer les moyennes de temps de résolution
  const averageResolutionTime = resolutionTimes.length > 0
    ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
    : 0;

  const avgResolutionBySeverity: Record<string, number> = {};
  Object.entries(resolutionTimesBySeverity).forEach(([severity, times]) => {
    if (times.length > 0) {
      avgResolutionBySeverity[severity] = times.reduce((sum, time) => sum + time, 0) / times.length;
    }
  });

  return {
    totalResolved,
    averageResolutionTime,
    bySeverity,
    byType,
    resolutionTimesBySeverity: avgResolutionBySeverity,
  };
}

/**
 * Exporter les alertes en CSV
 */
export const exportAlertsToCSV = (alerts: GDPRAlert[]): void => {
  // En-têtes CSV
  const headers = [
    'ID',
    'Type',
    'Sévérité',
    'Titre',
    'Description',
    'Date de création',
    'Date de résolution',
    'Temps de résolution (heures)',
    'Résolu par',
  ];

  // Convertir les données en lignes CSV
  const rows = alerts.map((alert) => {
    const createdAt = new Date(alert.created_at);
    const resolvedAt = alert.resolved_at ? new Date(alert.resolved_at) : null;
    const resolutionTimeHours = resolvedAt
      ? ((resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60)).toFixed(2)
      : 'N/A';

    return [
      alert.id,
      alert.alert_type,
      alert.severity,
      `"${alert.title.replace(/"/g, '""')}"`, // Échapper les guillemets
      `"${(alert.description || '').replace(/"/g, '""')}"`,
      createdAt.toLocaleString('fr-FR'),
      resolvedAt ? resolvedAt.toLocaleString('fr-FR') : 'N/A',
      resolutionTimeHours,
      alert.resolved_by || 'N/A',
    ];
  });

  // Créer le contenu CSV
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Créer et télécharger le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `alertes-rgpd-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logger.info(`Exported ${alerts.length} GDPR alerts to CSV`, undefined, 'GDPR');
};
