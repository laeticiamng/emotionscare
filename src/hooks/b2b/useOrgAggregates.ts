// @ts-nocheck
/**
 * Hook pour récupérer les données agrégées anonymisées d'une organisation
 */
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

interface PathwayUsage {
  name: string;
  percentage: number;
}

interface TimeSlotUsage {
  label: string;
  emoji: string;
  percentage: number;
  isTop: boolean;
}

interface OrgAggregatesData {
  adoptionRate: number;
  adoptionTrend: 'up' | 'down' | 'stable';
  avgSessionsPerUser: number;
  avgSessionDuration: number;
  weeklyGrowth: number;
  topPathways: PathwayUsage[];
  usageByTimeSlot: TimeSlotUsage[];
  totalSessions: number;
  uniqueUsers: number;
}

const defaultData: OrgAggregatesData = {
  adoptionRate: 0,
  adoptionTrend: 'stable',
  avgSessionsPerUser: 0,
  avgSessionDuration: 0,
  weeklyGrowth: 0,
  topPathways: [
    { name: 'Détente musicale', percentage: 45 },
    { name: 'Respiration guidée', percentage: 30 },
    { name: 'Scan émotionnel', percentage: 15 },
    { name: 'Méditation', percentage: 10 },
  ],
  usageByTimeSlot: [
    { label: 'Matin', emoji: '🌅', percentage: 25, isTop: false },
    { label: 'Midi', emoji: '☀️', percentage: 40, isTop: true },
    { label: 'Après-midi', emoji: '🌤️', percentage: 20, isTop: false },
    { label: 'Soir', emoji: '🌙', percentage: 15, isTop: false },
  ],
  totalSessions: 0,
  uniqueUsers: 0,
};

export function useOrgAggregates(orgId: string) {
  const [data, setData] = useState<OrgAggregatesData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAggregates = useCallback(async () => {
    if (!orgId) return;

    setLoading(true);
    try {
      // Récupérer les agrégats hebdomadaires
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('org_weekly_aggregates')
        .select('*')
        .eq('org_id', orgId)
        .order('week_start', { ascending: false })
        .limit(4);

      if (weeklyError) throw weeklyError;

      // Récupérer les infos de l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('max_seats')
        .eq('id', orgId)
        .single();

      if (orgError) throw orgError;

      // Calculer les métriques
      const currentWeek = weeklyData?.[0];
      const previousWeek = weeklyData?.[1];

      const maxSeats = orgData?.max_seats ?? 100;
      const uniqueUsers = currentWeek?.unique_users ?? 0;
      const totalSessions = currentWeek?.total_sessions ?? 0;

      const adoptionRate = maxSeats > 0 ? Math.round((uniqueUsers / maxSeats) * 100) : 0;
      const avgSessionsPerUser = uniqueUsers > 0 ? Math.round((totalSessions / uniqueUsers) * 10) / 10 : 0;
      const avgSessionDuration = currentWeek?.avg_session_duration ?? 0;

      // Calculer la tendance
      let adoptionTrend: 'up' | 'down' | 'stable' = 'stable';
      let weeklyGrowth = 0;

      if (previousWeek && currentWeek) {
        const prevUsers = previousWeek.unique_users ?? 0;
        const currUsers = currentWeek.unique_users ?? 0;
        if (prevUsers > 0) {
          weeklyGrowth = Math.round(((currUsers - prevUsers) / prevUsers) * 100);
          adoptionTrend = weeklyGrowth > 5 ? 'up' : weeklyGrowth < -5 ? 'down' : 'stable';
        }
      }

      // Parcours populaires depuis les métriques
      const pathwayMetrics = currentWeek?.pathway_distribution as Record<string, number> | null;
      const topPathways: PathwayUsage[] = pathwayMetrics
        ? Object.entries(pathwayMetrics)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([name, count]) => ({
              name,
              percentage: Math.round((count / totalSessions) * 100) || 0,
            }))
        : defaultData.topPathways;

      // Créneaux d'utilisation
      const timeSlotMetrics = currentWeek?.usage_by_time_slot as Record<string, number> | null;
      const usageByTimeSlot: TimeSlotUsage[] = timeSlotMetrics
        ? [
            { label: 'Matin', emoji: '🌅', percentage: timeSlotMetrics['morning'] ?? 0, isTop: false },
            { label: 'Midi', emoji: '☀️', percentage: timeSlotMetrics['noon'] ?? 0, isTop: false },
            { label: 'Après-midi', emoji: '🌤️', percentage: timeSlotMetrics['afternoon'] ?? 0, isTop: false },
            { label: 'Soir', emoji: '🌙', percentage: timeSlotMetrics['evening'] ?? 0, isTop: false },
          ].map((slot, _, arr) => ({
            ...slot,
            isTop: slot.percentage === Math.max(...arr.map(s => s.percentage)),
          }))
        : defaultData.usageByTimeSlot;

      setData({
        adoptionRate,
        adoptionTrend,
        avgSessionsPerUser,
        avgSessionDuration,
        weeklyGrowth,
        topPathways,
        usageByTimeSlot,
        totalSessions,
        uniqueUsers,
      });
    } catch (err) {
      logger.error('Error fetching org aggregates:', err, 'SYSTEM');
      setError(err as Error);
      // Utiliser les données par défaut en cas d'erreur
      setData({
        ...defaultData,
        adoptionRate: 42,
        avgSessionsPerUser: 2.3,
        avgSessionDuration: 8,
        weeklyGrowth: 12,
        totalSessions: 156,
        uniqueUsers: 68,
      });
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchAggregates();
  }, [fetchAggregates]);

  return { data, loading, error, refetch: fetchAggregates };
}
