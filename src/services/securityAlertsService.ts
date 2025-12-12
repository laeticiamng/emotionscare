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
}

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
 * Fetch recent unacknowledged alerts
 */
export async function fetchUnacknowledgedAlerts(): Promise<SecurityAlert[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('acknowledged', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching unacknowledged alerts', error as Error, 'SECURITY');
    return [];
  }
}

/**
 * Acknowledge a security alert
 */
export async function acknowledgeAlert(alertId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('security_alerts')
      .update({
        acknowledged: true,
        acknowledged_by: userId,
        acknowledged_at: new Date().toISOString(),
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
 * Get alert statistics
 */
export async function getAlertStatistics(days: number = 7): Promise<{
  total: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
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

    alerts.forEach((alert) => {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      byType[alert.alert_type] = (byType[alert.alert_type] || 0) + 1;
    });

    return {
      total: alerts.length,
      bySeverity,
      byType,
    };
  } catch (error) {
    logger.error('Error getting alert statistics', error as Error, 'SECURITY');
    return { total: 0, bySeverity: {}, byType: {} };
  }
}

// ========== MÉTHODES ENRICHIES ==========

/**
 * Créer une nouvelle alerte de sécurité
 */
export async function createAlert(alert: {
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: Record<string, any>;
}): Promise<SecurityAlert | null> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .insert({
        alert_type: alert.alertType,
        severity: alert.severity,
        message: alert.message,
        details: alert.details || {},
        acknowledged: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Security alert created', { alertId: data.id, type: alert.alertType }, 'SECURITY');
    return data as SecurityAlert;
  } catch (error) {
    logger.error('Error creating security alert', error as Error, 'SECURITY');
    return null;
  }
}

/**
 * Récupérer les alertes par sévérité
 */
export async function getAlertsBySeverity(
  severity: 'low' | 'medium' | 'high' | 'critical',
  limit: number = 50
): Promise<SecurityAlert[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('severity', severity)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching alerts by severity', error as Error, 'SECURITY');
    return [];
  }
}

/**
 * Récupérer les alertes par type
 */
export async function getAlertsByType(
  alertType: string,
  limit: number = 50
): Promise<SecurityAlert[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('alert_type', alertType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching alerts by type', error as Error, 'SECURITY');
    return [];
  }
}

/**
 * Supprimer une alerte
 */
export async function deleteAlert(alertId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('security_alerts')
      .delete()
      .eq('id', alertId);

    if (error) throw error;

    logger.info('Security alert deleted', { alertId }, 'SECURITY');
    return true;
  } catch (error) {
    logger.error('Error deleting alert', error as Error, 'SECURITY');
    return false;
  }
}

/**
 * Obtenir la timeline des alertes
 */
export async function getAlertTimeline(days: number = 30): Promise<Array<{
  date: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}>> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('security_alerts')
      .select('created_at, severity')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Grouper par jour
    const byDay: Record<string, { low: number; medium: number; high: number; critical: number }> = {};

    (data || []).forEach(alert => {
      const day = alert.created_at.split('T')[0];
      if (!byDay[day]) {
        byDay[day] = { low: 0, medium: 0, high: 0, critical: 0 };
      }
      byDay[day][alert.severity as keyof typeof byDay[typeof day]]++;
    });

    return Object.entries(byDay)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    logger.error('Error getting alert timeline', error as Error, 'SECURITY');
    return [];
  }
}

/**
 * Acquitter plusieurs alertes en une fois
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

  logger.info('Bulk acknowledge completed', { success, failed }, 'SECURITY');
  return { success, failed };
}

/**
 * Récupérer les alertes critiques non acquittées
 */
export async function getCriticalUnacknowledgedAlerts(): Promise<SecurityAlert[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('acknowledged', false)
      .in('severity', ['high', 'critical'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching critical alerts', error as Error, 'SECURITY');
    return [];
  }
}

/**
 * Obtenir le résumé des alertes
 */
export async function getAlertsSummary(): Promise<{
  totalUnacknowledged: number;
  criticalCount: number;
  highCount: number;
  lastAlertTime: string | null;
  mostCommonType: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('acknowledged', false);

    if (error) throw error;

    const alerts = data || [];
    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const highCount = alerts.filter(a => a.severity === 'high').length;

    // Type le plus fréquent
    const typeCounts: Record<string, number> = {};
    alerts.forEach(a => {
      typeCounts[a.alert_type] = (typeCounts[a.alert_type] || 0) + 1;
    });
    const mostCommonType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Dernière alerte
    const sorted = [...alerts].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      totalUnacknowledged: alerts.length,
      criticalCount,
      highCount,
      lastAlertTime: sorted[0]?.created_at || null,
      mostCommonType
    };
  } catch (error) {
    logger.error('Error getting alerts summary', error as Error, 'SECURITY');
    return {
      totalUnacknowledged: 0,
      criticalCount: 0,
      highCount: 0,
      lastAlertTime: null,
      mostCommonType: null
    };
  }
}

/**
 * Rechercher dans les alertes
 */
export async function searchAlerts(
  query: string,
  limit: number = 50
): Promise<SecurityAlert[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .or(`message.ilike.%${query}%,alert_type.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error searching alerts', error as Error, 'SECURITY');
    return [];
  }
}
