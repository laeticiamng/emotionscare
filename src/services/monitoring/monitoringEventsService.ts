import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type MonitoringEvent = Database['public']['Tables']['monitoring_events']['Row'];
export type MonitoringEventInsert = Database['public']['Tables']['monitoring_events']['Insert'];

export type EventType = 'error' | 'warning' | 'info' | 'performance' | 'user_action';
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EventContext = 'AUTH' | 'API' | 'UI' | 'SCAN' | 'VR' | 'MUSIC' | 'ANALYTICS' | 'SYSTEM' | 'ERROR_BOUNDARY' | 'SESSION' | 'CONSENT' | 'SOCIAL' | 'NYVEE' | 'WHO5' | 'STAI6' | 'BREATH' | 'FLASH' | 'MIXER' | 'SCORES' | 'COACH';

export interface MonitoringEventStats {
  totalEvents: number;
  criticalEvents: number;
  errorsByContext: Record<string, number>;
  eventsByType: Record<string, number>;
  recentTrend: { timestamp: string; count: number }[];
}

/**
 * Insert a new monitoring event
 */
export async function insertMonitoringEvent(event: Omit<MonitoringEventInsert, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('monitoring_events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch recent monitoring events with pagination
 */
export async function fetchMonitoringEvents(options?: {
  limit?: number;
  offset?: number;
  severity?: EventSeverity;
  context?: EventContext;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase
    .from('monitoring_events')
    .select('*', { count: 'exact' })
    .order('timestamp', { ascending: false });

  if (options?.severity) {
    query = query.eq('severity', options.severity);
  }

  if (options?.context) {
    query = query.eq('context', options.context);
  }

  if (options?.eventType) {
    query = query.eq('event_type', options.eventType);
  }

  if (options?.startDate) {
    query = query.gte('timestamp', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('timestamp', options.endDate);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { events: data || [], count: count || 0 };
}

/**
 * Fetch monitoring statistics
 */
export async function fetchMonitoringStats(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<MonitoringEventStats> {
  const now = new Date();
  const startDate = new Date(now);
  
  switch (timeRange) {
    case '1h':
      startDate.setHours(now.getHours() - 1);
      break;
    case '24h':
      startDate.setHours(now.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
  }

  const { data, error } = await supabase
    .from('monitoring_events')
    .select('*')
    .gte('timestamp', startDate.toISOString());

  if (error) throw error;

  const events = data || [];

  // Calculate statistics
  const totalEvents = events.length;
  const criticalEvents = events.filter(e => e.severity === 'critical').length;

  const errorsByContext: Record<string, number> = {};
  const eventsByType: Record<string, number> = {};

  events.forEach(event => {
    errorsByContext[event.context] = (errorsByContext[event.context] || 0) + 1;
    eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
  });

  // Calculate trend (hourly buckets)
  const recentTrend: { timestamp: string; count: number }[] = [];
  const buckets = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const bucketSize = (now.getTime() - startDate.getTime()) / buckets;

  for (let i = 0; i < buckets; i++) {
    const bucketStart = new Date(startDate.getTime() + i * bucketSize);
    const bucketEnd = new Date(startDate.getTime() + (i + 1) * bucketSize);
    
    const count = events.filter(e => {
      const eventTime = new Date(e.timestamp).getTime();
      return eventTime >= bucketStart.getTime() && eventTime < bucketEnd.getTime();
    }).length;

    recentTrend.push({
      timestamp: bucketStart.toISOString(),
      count,
    });
  }

  return {
    totalEvents,
    criticalEvents,
    errorsByContext,
    eventsByType,
    recentTrend,
  };
}

/**
 * Delete monitoring events older than specified days
 */
export async function cleanupOldMonitoringEvents(daysOld: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const { error } = await supabase
    .from('monitoring_events')
    .delete()
    .lt('timestamp', cutoffDate.toISOString());

  if (error) throw error;
}
