import { useState, useEffect } from 'react';
import { ChartData, DashboardStats } from '../tabs/overview/types';
import { useSegment } from '@/contexts/SegmentContext';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = (timePeriod: string) => {
  const [absenteeismData, setAbsenteeismData] = useState<ChartData[]>([]);
  const [productivityData, setProductivityData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const segment = (useSegment() as any)?.segment;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const days = parseInt(timePeriod) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: logs, error } = await supabase
        .from('user_activity_logs')
        .select('activity_type, timestamp')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        logger.error('Failed to fetch dashboard data', { error }, 'admin');
        return;
      }

      const absenteeismMap = new Map<string, number>();
      const productivityMap = new Map<string, number>();

      for (const log of (logs || [])) {
        const day = log.timestamp ? log.timestamp.split('T')[0] : 'unknown';
        if (log.activity_type === 'absence' || log.activity_type === 'leave') {
          absenteeismMap.set(day, (absenteeismMap.get(day) ?? 0) + 1);
        } else {
          productivityMap.set(day, (productivityMap.get(day) ?? 0) + 1);
        }
      }

      setAbsenteeismData(Array.from(absenteeismMap.entries()).map(([date, value]) => ({ date, value })));
      setProductivityData(Array.from(productivityMap.entries()).map(([date, value]) => ({ date, value })));
    } catch (error) {
      logger.error("Error fetching dashboard data:", error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod, segment]);

  return {
    absenteeismData,
    productivityData,
    isLoading,
    refetchAll: fetchData
  };
};

export const useEmotionalScoreTrend = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { segment } = useSegment();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: scans, error } = await supabase
        .from('emotion_scans')
        .select('score, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        logger.error('Failed to fetch emotional score trend', { error }, 'admin');
        return;
      }

      const grouped = new Map<string, number[]>();
      for (const scan of (scans || [])) {
        const day = scan.created_at ? scan.created_at.split('T')[0] : 'unknown';
        const arr = grouped.get(day) || [];
        arr.push(scan.score ?? 0);
        grouped.set(day, arr);
      }

      const chartData: ChartData[] = Array.from(grouped.entries()).map(([date, scores]) => ({
        date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' }),
        value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }));

      setData(chartData);
    } catch (error) {
      logger.error("Error fetching emotional score trend:", error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [segment]);

  return {
    data,
    isLoading,
    refetch: fetchData
  };
};

export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardStats>({
    totalUsers: 0,
    activeToday: 0,
    averageScore: 0,
    criticalAlerts: 0,
    completion: 0,
    productivity: { current: 0, trend: 0 },
    emotionalScore: { current: 0, trend: 0 }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { segment } = useSegment();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const today = new Date().toISOString().split('T')[0];

      const [usersResult, activeResult, scoresResult, alertsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_activity_logs').select('id', { count: 'exact', head: true }).gte('timestamp', today),
        supabase.from('emotion_scans').select('score').order('created_at', { ascending: false }).limit(100),
        supabase.from('user_alerts').select('id', { count: 'exact', head: true }).eq('severity', 'critical').eq('resolved', false),
      ]);

      const totalUsers = usersResult.count ?? 0;
      const activeToday = activeResult.count ?? 0;
      const scores = (scoresResult.data || []).map((s: any) => s.score ?? 0);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      const criticalAlerts = alertsResult.count ?? 0;

      setData({
        totalUsers,
        activeToday,
        averageScore: avgScore,
        criticalAlerts,
        completion: totalUsers > 0 ? Math.round((activeToday / totalUsers) * 100) : 0,
        productivity: { current: 85, trend: 3 },
        emotionalScore: { current: avgScore, trend: 2 }
      });
    } catch (error) {
      logger.error("Error fetching dashboard stats:", error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [segment]);

  return {
    data,
    isLoading,
    refetch: fetchData
  };
};
