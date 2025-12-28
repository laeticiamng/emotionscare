/**
 * Hook pour les statistiques et insights SEUIL
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfWeek, subDays, format, isToday, isYesterday, differenceInDays } from 'date-fns';
import type { SeuilZone, SeuilEvent } from '../types';

export interface SeuilStats {
  totalEvents: number;
  completedSessions: number;
  completionRate: number;
  averageLevel: number;
  zoneDistribution: Record<SeuilZone, number>;
  weeklyTrend: { date: string; avgLevel: number; count: number }[];
  currentStreak: number;
  longestStreak: number;
  mostCommonZone: SeuilZone;
  mostCommonTime: string;
  lastWeekComparison: {
    currentWeekAvg: number;
    lastWeekAvg: number;
    change: number;
  };
  patterns: SeuilPattern[];
}

export interface SeuilPattern {
  type: 'time' | 'day' | 'zone_sequence' | 'improvement';
  description: string;
  confidence: number;
}

export function useSeuilStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['seuil-stats', user?.id],
    queryFn: async (): Promise<SeuilStats> => {
      if (!user?.id) throw new Error('Non authentifié');

      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      const { data, error } = await supabase
        .from('seuil_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const events: SeuilEvent[] = (data || []).map(e => ({
        id: e.id,
        userId: e.user_id,
        thresholdLevel: e.threshold_level,
        zone: e.zone as SeuilZone,
        actionTaken: e.action_taken || undefined,
        actionType: e.action_type || undefined,
        sessionCompleted: e.session_completed || false,
        notes: e.notes || undefined,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      }));

      return calculateStats(events);
    },
    enabled: !!user?.id,
    staleTime: 60000, // 1 minute
  });
}

function calculateStats(events: SeuilEvent[]): SeuilStats {
  const totalEvents = events.length;
  const completedSessions = events.filter(e => e.sessionCompleted).length;
  const completionRate = totalEvents > 0 ? (completedSessions / totalEvents) * 100 : 0;

  // Average level
  const averageLevel = totalEvents > 0
    ? events.reduce((sum, e) => sum + e.thresholdLevel, 0) / totalEvents
    : 0;

  // Zone distribution
  const zoneDistribution: Record<SeuilZone, number> = {
    low: 0,
    intermediate: 0,
    critical: 0,
    closure: 0,
  };
  events.forEach(e => {
    zoneDistribution[e.zone]++;
  });

  // Most common zone
  const mostCommonZone = (Object.entries(zoneDistribution) as [SeuilZone, number][])
    .reduce((a, b) => b[1] > a[1] ? b : a, ['low', 0] as [SeuilZone, number])[0];

  // Weekly trend
  const weeklyTrend: { date: string; avgLevel: number; count: number }[] = [];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  last7Days.forEach(dateStr => {
    const dayEvents = events.filter(e => 
      format(new Date(e.createdAt), 'yyyy-MM-dd') === dateStr
    );
    weeklyTrend.push({
      date: dateStr,
      avgLevel: dayEvents.length > 0
        ? dayEvents.reduce((s, e) => s + e.thresholdLevel, 0) / dayEvents.length
        : 0,
      count: dayEvents.length,
    });
  });

  // Streak calculation
  const { currentStreak, longestStreak } = calculateStreaks(events);

  // Most common time
  const hourCounts = new Map<number, number>();
  events.forEach(e => {
    const hour = new Date(e.createdAt).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });
  const mostCommonHour = [...hourCounts.entries()]
    .reduce((a, b) => b[1] > a[1] ? b : a, [12, 0])[0];
  const mostCommonTime = formatTimeRange(mostCommonHour);

  // Week comparison
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const lastWeekStart = subDays(currentWeekStart, 7);
  
  const currentWeekEvents = events.filter(e => 
    new Date(e.createdAt) >= currentWeekStart
  );
  const lastWeekEvents = events.filter(e => {
    const date = new Date(e.createdAt);
    return date >= lastWeekStart && date < currentWeekStart;
  });

  const currentWeekAvg = currentWeekEvents.length > 0
    ? currentWeekEvents.reduce((s, e) => s + e.thresholdLevel, 0) / currentWeekEvents.length
    : 0;
  const lastWeekAvg = lastWeekEvents.length > 0
    ? lastWeekEvents.reduce((s, e) => s + e.thresholdLevel, 0) / lastWeekEvents.length
    : 0;

  // Patterns detection
  const patterns = detectPatterns(events, zoneDistribution, mostCommonHour);

  return {
    totalEvents,
    completedSessions,
    completionRate,
    averageLevel,
    zoneDistribution,
    weeklyTrend,
    currentStreak,
    longestStreak,
    mostCommonZone,
    mostCommonTime,
    lastWeekComparison: {
      currentWeekAvg,
      lastWeekAvg,
      change: lastWeekAvg > 0 ? ((currentWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 : 0,
    },
    patterns,
  };
}

function calculateStreaks(events: SeuilEvent[]): { currentStreak: number; longestStreak: number } {
  if (events.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dates = [...new Set(events.map(e => 
    format(new Date(e.createdAt), 'yyyy-MM-dd')
  ))].sort().reverse();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  // Calculate current streak (from today backwards)
  const today = format(new Date(), 'yyyy-MM-dd');
  if (dates[0] === today || dates[0] === format(subDays(new Date(), 1), 'yyyy-MM-dd')) {
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const expectedDate = subDays(new Date(), i);
      
      if (format(date, 'yyyy-MM-dd') === format(expectedDate, 'yyyy-MM-dd')) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  dates.sort().forEach(dateStr => {
    const date = new Date(dateStr);
    if (!prevDate || differenceInDays(date, prevDate) === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
    prevDate = date;
  });
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

function formatTimeRange(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Matin (5h-12h)';
  if (hour >= 12 && hour < 14) return 'Midi (12h-14h)';
  if (hour >= 14 && hour < 18) return 'Après-midi (14h-18h)';
  if (hour >= 18 && hour < 22) return 'Soir (18h-22h)';
  return 'Nuit (22h-5h)';
}

function detectPatterns(
  events: SeuilEvent[],
  zoneDistribution: Record<SeuilZone, number>,
  mostCommonHour: number
): SeuilPattern[] {
  const patterns: SeuilPattern[] = [];

  // Time pattern
  if (events.length >= 5) {
    const timeRange = formatTimeRange(mostCommonHour);
    patterns.push({
      type: 'time',
      description: `Tu ressens souvent un décalage le ${timeRange.toLowerCase()}`,
      confidence: 0.7,
    });
  }

  // Zone sequence pattern - improvement
  const recentEvents = events.slice(-10);
  if (recentEvents.length >= 5) {
    const recentAvg = recentEvents.reduce((s, e) => s + e.thresholdLevel, 0) / recentEvents.length;
    const oldAvg = events.slice(0, -10).reduce((s, e) => s + e.thresholdLevel, 0) / Math.max(1, events.length - 10);
    
    if (recentAvg < oldAvg - 10) {
      patterns.push({
        type: 'improvement',
        description: 'Tes niveaux récents sont plus bas - bonne progression ! 🌿',
        confidence: 0.8,
      });
    }
  }

  // Dominant zone pattern
  const totalZones = Object.values(zoneDistribution).reduce((a, b) => a + b, 0);
  const dominantZone = Object.entries(zoneDistribution) as [SeuilZone, number][];
  dominantZone.forEach(([zone, count]) => {
    if (count / totalZones > 0.5 && count >= 3) {
      const zoneLabels = {
        low: 'basse',
        intermediate: 'intermédiaire',
        critical: 'critique',
        closure: 'clôture',
      };
      patterns.push({
        type: 'zone_sequence',
        description: `Tu es majoritairement en zone ${zoneLabels[zone]}`,
        confidence: 0.9,
      });
    }
  });

  return patterns.slice(0, 3); // Max 3 patterns
}

export function useSeuilTrendData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['seuil-trend-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      const { data, error } = await supabase
        .from('seuil_events')
        .select('threshold_level, zone, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(e => ({
        level: e.threshold_level,
        zone: e.zone as SeuilZone,
        date: e.created_at,
      }));
    },
    enabled: !!user?.id,
  });
}
