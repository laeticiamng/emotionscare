// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

/** Paramètres pour récupérer les données d'activité */
export interface ActivityDataParams {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  activityTypes?: string[];
  modules?: string[];
  limit?: number;
  offset?: number;
  orderBy?: 'timestamp' | 'duration' | 'type';
  orderDirection?: 'asc' | 'desc';
}

/** Donnée d'activité */
export interface ActivityData {
  id: string;
  userId: string;
  activityType: string;
  module: string;
  description?: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  completedAt?: Date;
  score?: number;
}

/** Statistiques d'activité */
export interface ActivityStats {
  totalActivities: number;
  totalDuration: number;
  averageDuration: number;
  activitiesByType: Record<string, number>;
  activitiesByModule: Record<string, number>;
  activitiesByDay: { date: string; count: number; duration: number }[];
  mostActiveHour: number;
  streakDays: number;
  completionRate: number;
  averageScore: number;
}

/** Tendance d'activité */
export interface ActivityTrend {
  period: string;
  count: number;
  duration: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

/** Résumé quotidien */
export interface DailyActivitySummary {
  date: string;
  totalActivities: number;
  totalDuration: number;
  modules: string[];
  topActivity: string;
  moodBefore?: number;
  moodAfter?: number;
  achievements: string[];
}

/**
 * Gets activity data for analytics
 */
export async function getActivityData(params: ActivityDataParams = {}): Promise<ActivityData[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = params.userId || userData.user?.id;

    if (!userId) return [];

    let query = supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId);

    if (params.startDate) {
      query = query.gte('timestamp', params.startDate.toISOString());
    }

    if (params.endDate) {
      query = query.lte('timestamp', params.endDate.toISOString());
    }

    if (params.activityTypes && params.activityTypes.length > 0) {
      query = query.in('activity_type', params.activityTypes);
    }

    if (params.modules && params.modules.length > 0) {
      query = query.in('module', params.modules);
    }

    const orderBy = params.orderBy || 'timestamp';
    const orderDirection = params.orderDirection === 'asc';
    query = query.order(orderBy, { ascending: orderDirection });

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      activityType: item.activity_type,
      module: item.module || 'unknown',
      description: item.description,
      duration: item.duration || 0,
      timestamp: new Date(item.timestamp),
      metadata: item.metadata,
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
      score: item.score
    }));
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return [];
  }
}

/**
 * Gets activity statistics
 */
export async function getActivityStats(params: ActivityDataParams = {}): Promise<ActivityStats> {
  try {
    const activities = await getActivityData({
      ...params,
      limit: undefined // Get all for stats
    });

    if (activities.length === 0) {
      return {
        totalActivities: 0,
        totalDuration: 0,
        averageDuration: 0,
        activitiesByType: {},
        activitiesByModule: {},
        activitiesByDay: [],
        mostActiveHour: 12,
        streakDays: 0,
        completionRate: 0,
        averageScore: 0
      };
    }

    // Calculer les statistiques
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
    const averageDuration = totalDuration / activities.length;

    // Par type
    const activitiesByType: Record<string, number> = {};
    for (const activity of activities) {
      activitiesByType[activity.activityType] = (activitiesByType[activity.activityType] || 0) + 1;
    }

    // Par module
    const activitiesByModule: Record<string, number> = {};
    for (const activity of activities) {
      activitiesByModule[activity.module] = (activitiesByModule[activity.module] || 0) + 1;
    }

    // Par jour
    const byDay: Record<string, { count: number; duration: number }> = {};
    for (const activity of activities) {
      const date = activity.timestamp.toISOString().split('T')[0];
      if (!byDay[date]) {
        byDay[date] = { count: 0, duration: 0 };
      }
      byDay[date].count++;
      byDay[date].duration += activity.duration;
    }
    const activitiesByDay = Object.entries(byDay)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Heure la plus active
    const hourCounts: Record<number, number> = {};
    for (const activity of activities) {
      const hour = activity.timestamp.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    const mostActiveHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 12;

    // Streak (jours consécutifs)
    const sortedDates = [...new Set(activities.map(a => a.timestamp.toISOString().split('T')[0]))].sort();
    let streakDays = 0;
    let currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
        streakDays = Math.max(streakDays, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    // Taux de complétion
    const completed = activities.filter(a => a.completedAt).length;
    const completionRate = activities.length > 0 ? (completed / activities.length) * 100 : 0;

    // Score moyen
    const scored = activities.filter(a => a.score !== undefined);
    const averageScore = scored.length > 0
      ? scored.reduce((sum, a) => sum + (a.score || 0), 0) / scored.length
      : 0;

    return {
      totalActivities: activities.length,
      totalDuration,
      averageDuration,
      activitiesByType,
      activitiesByModule,
      activitiesByDay,
      mostActiveHour: parseInt(mostActiveHour.toString()),
      streakDays,
      completionRate,
      averageScore
    };
  } catch (error) {
    console.error('Error calculating activity stats:', error);
    return {
      totalActivities: 0,
      totalDuration: 0,
      averageDuration: 0,
      activitiesByType: {},
      activitiesByModule: {},
      activitiesByDay: [],
      mostActiveHour: 12,
      streakDays: 0,
      completionRate: 0,
      averageScore: 0
    };
  }
}

/**
 * Gets activity trends over time
 */
export async function getActivityTrends(
  userId: string,
  periodDays: number = 30
): Promise<ActivityTrend[]> {
  try {
    const now = new Date();
    const periods: ActivityTrend[] = [];

    for (let i = 0; i < 4; i++) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - (i * periodDays));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - periodDays);

      const activities = await getActivityData({
        userId,
        startDate,
        endDate
      });

      const count = activities.length;
      const duration = activities.reduce((sum, a) => sum + a.duration, 0);

      periods.push({
        period: `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`,
        count,
        duration,
        change: 0,
        trend: 'stable'
      });
    }

    // Calculer les changements
    for (let i = 0; i < periods.length - 1; i++) {
      const current = periods[i];
      const previous = periods[i + 1];
      if (previous.count > 0) {
        current.change = Math.round(((current.count - previous.count) / previous.count) * 100);
        current.trend = current.change > 10 ? 'up' : current.change < -10 ? 'down' : 'stable';
      }
    }

    return periods;
  } catch (error) {
    console.error('Error getting activity trends:', error);
    return [];
  }
}

/**
 * Gets daily activity summary
 */
export async function getDailyActivitySummary(
  userId: string,
  date: Date
): Promise<DailyActivitySummary | null> {
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const activities = await getActivityData({
      userId,
      startDate,
      endDate
    });

    if (activities.length === 0) return null;

    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
    const modules = [...new Set(activities.map(a => a.module))];

    // Activité la plus fréquente
    const typeCounts: Record<string, number> = {};
    for (const a of activities) {
      typeCounts[a.activityType] = (typeCounts[a.activityType] || 0) + 1;
    }
    const topActivity = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    return {
      date: date.toISOString().split('T')[0],
      totalActivities: activities.length,
      totalDuration,
      modules,
      topActivity,
      achievements: []
    };
  } catch (error) {
    console.error('Error getting daily summary:', error);
    return null;
  }
}

/**
 * Exports activity data to CSV
 */
export async function exportActivityData(params: ActivityDataParams = {}): Promise<string> {
  const activities = await getActivityData(params);

  let csv = 'ID,Type,Module,Description,Duration,Timestamp,Score\n';
  for (const activity of activities) {
    csv += `${activity.id},${activity.activityType},${activity.module},"${activity.description || ''}",${activity.duration},${activity.timestamp.toISOString()},${activity.score || ''}\n`;
  }

  return csv;
}

/**
 * Gets module-specific activity data
 */
export async function getModuleActivityData(
  userId: string,
  module: string,
  limit: number = 50
): Promise<ActivityData[]> {
  return getActivityData({
    userId,
    modules: [module],
    limit,
    orderBy: 'timestamp',
    orderDirection: 'desc'
  });
}

/**
 * Gets recent activities
 */
export async function getRecentActivities(
  userId: string,
  limit: number = 10
): Promise<ActivityData[]> {
  return getActivityData({
    userId,
    limit,
    orderBy: 'timestamp',
    orderDirection: 'desc'
  });
}
