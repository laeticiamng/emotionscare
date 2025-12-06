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
