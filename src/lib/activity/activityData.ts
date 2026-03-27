// @ts-nocheck
import { AnonymizedActivityLog, ActivityStats } from './activityTypes';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Fetch anonymized activity logs from the user_activity_logs table.
 * Groups by activity_type and day for anonymized reporting.
 */
export async function fetchAnonymizedLogs(): Promise<AnonymizedActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('id, activity_type, category, timestamp')
      .order('timestamp', { ascending: false })
      .limit(500);

    if (error) {
      logger.error('Failed to fetch activity logs', { error }, 'activity-data');
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Aggregate logs by activity_type and day
    const buckets = new Map<string, AnonymizedActivityLog>();

    for (const row of data) {
      const day = row.timestamp ? row.timestamp.split('T')[0] : 'unknown';
      const key = `${row.activity_type}-${day}`;
      const existing = buckets.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        buckets.set(key, {
          id: row.id,
          activity_type: row.activity_type ?? 'unknown',
          category: row.category ?? 'other',
          count: 1,
          timestamp_day: day,
        });
      }
    }

    return Array.from(buckets.values());
  } catch (err) {
    logger.error('Unexpected error fetching activity logs', { err }, 'activity-data');
    return [];
  }
}

/**
 * Fetch activity statistics aggregated by activity_type from the user_activity_logs table.
 */
export async function fetchActivityStats(): Promise<ActivityStats[]> {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('activity_type');

    if (error) {
      logger.error('Failed to fetch activity stats', { error }, 'activity-data');
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Aggregate counts per activity_type
    const counts = new Map<string, number>();
    for (const row of data) {
      const type = row.activity_type ?? 'unknown';
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }

    const total = data.length;

    return Array.from(counts.entries()).map(([activity_type, total_count]) => ({
      activity_type,
      total_count,
      percentage: total > 0 ? Math.round((total_count / total) * 100) : 0,
    }));
  } catch (err) {
    logger.error('Unexpected error fetching activity stats', { err }, 'activity-data');
    return [];
  }
}

