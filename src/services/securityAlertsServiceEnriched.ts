// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  created_at: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  risk_score?: number;
  category?: string;
  source?: string;
  resolution_notes?: string;
}

export interface AlertTrend {
  date: string;
  count: number;
  bySeverity: Record<string, number>;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: Array<{
    name: string;
    score: number;
    description: string;
  }>;
  recommendations: string[];
}

export interface AlertFilter {
  severity?: string[];
  types?: string[];
  dateFrom?: string;
  dateTo?: string;
  acknowledged?: boolean;
  searchQuery?: string;
}

export interface SecurityReport {
  id: string;
  generatedAt: string;
  period: { start: string; end: string };
  summary: {
    totalAlerts: number;
    resolvedAlerts: number;
    criticalAlerts: number;
    averageResolutionTime: number;
  };
  trends: AlertTrend[];
  topVulnerabilities: Array<{ type: string; count: number }>;
  recommendations: string[];
}

const ALERT_HISTORY_KEY = 'emotionscare_security_alerts_history';

/**
 * Subscribe to real-time security alerts
 */
export function subscribeToSecurityAlerts(
  callback: (alert: SecurityAlert) => void
): () => void {
  try {
    const channel = supabase
      .channel('security-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts',
        },
        (payload) => {
          logger.info('New security alert received', payload.new, 'SECURITY');
          callback(payload.new as SecurityAlert);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    logger.error('Error subscribing to security alerts', error as Error, 'SECURITY');
    return () => {};
  }
}

/**
 * Fetch alerts with advanced filtering
 */
export async function fetchAlerts(filter: AlertFilter = {}): Promise<SecurityAlert[]> {
  try {
    let query = supabase
      .from('security_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter.severity?.length) {
      query = query.in('severity', filter.severity);
    }

    if (filter.types?.length) {
      query = query.in('alert_type', filter.types);
    }

    if (filter.dateFrom) {
      query = query.gte('created_at', filter.dateFrom);
    }

    if (filter.dateTo) {
      query = query.lte('created_at', filter.dateTo);
    }

    if (filter.acknowledged !== undefined) {
      query = query.eq('acknowledged', filter.acknowledged);
    }

    const { data, error } = await query.limit(500);

    if (error) throw error;

    let alerts = data || [];

    // Filtrage par recherche textuelle
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      alerts = alerts.filter(a =>
        a.message.toLowerCase().includes(q) ||
        a.alert_type.toLowerCase().includes(q)
      );
    }

    return alerts;
  } catch (error) {
    logger.error('Error fetching alerts', error as Error, 'SECURITY');
    return [];
  }
}

/**
 * Fetch recent unacknowledged alerts
 */
export async function fetchUnacknowledgedAlerts(): Promise<SecurityAlert[]> {
  return fetchAlerts({ acknowledged: false });
}

/**
 * Acknowledge a security alert with notes
 */
export async function acknowledgeAlert(
  alertId: string,
  userId: string,
  resolutionNotes?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('security_alerts')
      .update({
        acknowledged: true,
        acknowledged_by: userId,
        acknowledged_at: new Date().toISOString(),
        resolution_notes: resolutionNotes || null,
      })
      .eq('id', alertId);

    if (error) throw error;

    logger.info('Security alert acknowledged', { alertId, userId }, 'SECURITY');
  } catch (error) {
    logger.error('Error acknowledging alert', error as Error, 'SECURITY');
    throw error;
  }
}

/**
 * Bulk acknowledge alerts
 */
export async function bulkAcknowledgeAlerts(
  alertIds: string[],
  userId: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const alertId of alertIds) {
    try {
      await acknowledgeAlert(alertId, userId);
      success++;
    } catch {
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Get alert statistics with trends
 */
export async function getAlertStatistics(days: number = 7): Promise<{
  total: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  trends: AlertTrend[];
  averageResolutionTime: number;
}> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const alerts = data || [];
    
    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byDate: Map<string, { count: number; bySeverity: Record<string, number> }> = new Map();

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    alerts.forEach((alert) => {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      byType[alert.alert_type] = (byType[alert.alert_type] || 0) + 1;

      // Grouper par date
      const date = alert.created_at.split('T')[0];
      if (!byDate.has(date)) {
        byDate.set(date, { count: 0, bySeverity: {} });
      }
      const dateData = byDate.get(date)!;
      dateData.count++;
      dateData.bySeverity[alert.severity] = (dateData.bySeverity[alert.severity] || 0) + 1;

      // Calculer temps de résolution
      if (alert.acknowledged && alert.acknowledged_at) {
        const created = new Date(alert.created_at).getTime();
        const resolved = new Date(alert.acknowledged_at).getTime();
        totalResolutionTime += (resolved - created) / 1000 / 60; // en minutes
        resolvedCount++;
      }
    });

    const trends: AlertTrend[] = Array.from(byDate.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        bySeverity: data.bySeverity
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total: alerts.length,
      bySeverity,
      byType,
      trends,
      averageResolutionTime: resolvedCount > 0 ? Math.round(totalResolutionTime / resolvedCount) : 0
    };
  } catch (error) {
    logger.error('Error getting alert statistics', error as Error, 'SECURITY');
    return { total: 0, bySeverity: {}, byType: {}, trends: [], averageResolutionTime: 0 };
  }
}

/**
 * Perform risk assessment
 */
export async function performRiskAssessment(): Promise<RiskAssessment> {
  try {
    const stats = await getAlertStatistics(30);
    
    const factors: RiskAssessment['factors'] = [];
    let totalScore = 0;

    // Facteur: alertes critiques récentes
    const criticalCount = stats.bySeverity['critical'] || 0;
    const criticalScore = Math.min(criticalCount * 25, 100);
    factors.push({
      name: 'Alertes critiques',
      score: criticalScore,
      description: `${criticalCount} alertes critiques ces 30 derniers jours`
    });
    totalScore += criticalScore * 0.4;

    // Facteur: volume d'alertes
    const volumeScore = Math.min(stats.total * 2, 100);
    factors.push({
      name: 'Volume d\'alertes',
      score: volumeScore,
      description: `${stats.total} alertes totales ces 30 derniers jours`
    });
    totalScore += volumeScore * 0.2;

    // Facteur: temps de résolution
    const resolutionScore = stats.averageResolutionTime > 60 ? 75 : 
      stats.averageResolutionTime > 30 ? 50 : 25;
    factors.push({
      name: 'Temps de résolution',
      score: resolutionScore,
      description: `Temps moyen: ${stats.averageResolutionTime} minutes`
    });
    totalScore += resolutionScore * 0.2;

    // Facteur: alertes non résolues
    const unresolved = await fetchUnacknowledgedAlerts();
    const unresolvedScore = Math.min(unresolved.length * 10, 100);
    factors.push({
      name: 'Alertes non résolues',
      score: unresolvedScore,
      description: `${unresolved.length} alertes en attente`
    });
    totalScore += unresolvedScore * 0.2;

    const riskScore = Math.round(totalScore);
    const overallRisk: RiskAssessment['overallRisk'] = 
      riskScore >= 75 ? 'critical' :
      riskScore >= 50 ? 'high' :
      riskScore >= 25 ? 'medium' : 'low';

    const recommendations: string[] = [];
    if (criticalCount > 0) {
      recommendations.push('Traiter immédiatement les alertes critiques en attente');
    }
    if (stats.averageResolutionTime > 60) {
      recommendations.push('Améliorer le temps de réponse aux alertes de sécurité');
    }
    if (unresolved.length > 10) {
      recommendations.push('Réduire le backlog d\'alertes non résolues');
    }

    return {
      overallRisk,
      riskScore,
      factors,
      recommendations
    };
  } catch (error) {
    logger.error('Error performing risk assessment', error as Error, 'SECURITY');
    return {
      overallRisk: 'medium',
      riskScore: 50,
      factors: [],
      recommendations: []
    };
  }
}

/**
 * Generate security report
 */
export async function generateSecurityReport(days: number = 30): Promise<SecurityReport> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await getAlertStatistics(days);
  const allAlerts = await fetchAlerts({
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString()
  });

  const resolvedAlerts = allAlerts.filter(a => a.acknowledged).length;
  const criticalAlerts = allAlerts.filter(a => a.severity === 'critical').length;

  const topVulnerabilities = Object.entries(stats.byType)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recommendations: string[] = [];
  if (criticalAlerts > 0) {
    recommendations.push(`${criticalAlerts} alertes critiques nécessitent une attention immédiate`);
  }
  if (stats.averageResolutionTime > 120) {
    recommendations.push('Le temps moyen de résolution dépasse 2 heures - envisager des alertes automatiques');
  }
  if (topVulnerabilities[0]?.count > 10) {
    recommendations.push(`Le type "${topVulnerabilities[0].type}" est récurrent - investigation recommandée`);
  }

  return {
    id: Date.now().toString(),
    generatedAt: new Date().toISOString(),
    period: { start: startDate.toISOString(), end: endDate.toISOString() },
    summary: {
      totalAlerts: stats.total,
      resolvedAlerts,
      criticalAlerts,
      averageResolutionTime: stats.averageResolutionTime
    },
    trends: stats.trends,
    topVulnerabilities,
    recommendations
  };
}

/**
 * Export alerts to file
 */
export async function exportAlerts(
  filter: AlertFilter = {},
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const alerts = await fetchAlerts(filter);

  if (format === 'csv') {
    const headers = 'ID,Type,Severity,Message,Created At,Acknowledged,Acknowledged By,Acknowledged At\n';
    const rows = alerts.map(a =>
      `${a.id},"${a.alert_type}",${a.severity},"${a.message.replace(/"/g, '""')}",${a.created_at},${a.acknowledged},${a.acknowledged_by || ''},${a.acknowledged_at || ''}`
    ).join('\n');
    return headers + rows;
  }

  return JSON.stringify({
    alerts,
    exportedAt: new Date().toISOString(),
    filter
  }, null, 2);
}

/**
 * Download alerts export
 */
export async function downloadAlerts(
  filter: AlertFilter = {},
  format: 'json' | 'csv' = 'json'
): Promise<void> {
  const content = await exportAlerts(filter, format);
  const blob = new Blob([content], {
    type: format === 'json' ? 'application/json' : 'text/csv'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `security-alerts-${new Date().toISOString().split('T')[0]}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Create manual alert
 */
export async function createManualAlert(
  alertType: string,
  severity: SecurityAlert['severity'],
  message: string,
  details: Record<string, any> = {}
): Promise<SecurityAlert | null> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .insert({
        alert_type: alertType,
        severity,
        message,
        details,
        acknowledged: false,
        source: 'manual'
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Manual security alert created', { alertType, severity }, 'SECURITY');
    return data;
  } catch (error) {
    logger.error('Error creating manual alert', error as Error, 'SECURITY');
    return null;
  }
}

/**
 * Get alert types for filtering
 */
export async function getAlertTypes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('alert_type')
      .limit(1000);

    if (error) throw error;

    const types = new Set<string>();
    (data || []).forEach(a => types.add(a.alert_type));
    return Array.from(types).sort();
  } catch (error) {
    logger.error('Error fetching alert types', error as Error, 'SECURITY');
    return [];
  }
}
