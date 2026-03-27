// @ts-nocheck
import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface ReportingStats {
  emotionalScore: number;
  emotionalScoreChange: number;
  completedSessions: number;
  completedSessionsChange: number;
  badgesEarned: number;
  badgesEarnedChange: number;
  progressPercentage: number;
  progressChange: number;
}

interface ChartData {
  overview: Array<{ date: string; value: number }>;
  emotions: Array<{ name: string; value: number; color: string }>;
  progress: Array<{ date: string; score: number; target: number }>;
}

interface ReportingContextType {
  stats: ReportingStats;
  chartData: ChartData | null;
  isLoading: boolean;
  loadData: (period: string) => void;
  exportReport: (format: string) => Promise<void>;
}

const defaultStats: ReportingStats = {
  emotionalScore: 0,
  emotionalScoreChange: 0,
  completedSessions: 0,
  completedSessionsChange: 0,
  badgesEarned: 0,
  badgesEarnedChange: 0,
  progressPercentage: 0,
  progressChange: 0,
};

const ReportingContext = createContext<ReportingContextType | undefined>(undefined);

export const ReportingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ReportingStats>(defaultStats);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const loadData = useCallback(async (period: string) => {
    setIsLoading(true);
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: user } = await supabase.auth.getUser();
      const userId = user?.user?.id;
      if (!userId) {
        setChartData({ overview: [], emotions: [], progress: [] });
        setStats(defaultStats);
        setIsLoading(false);
        return;
      }

      const [scansResult, sessionsResult, badgesResult] = await Promise.all([
        supabase.from('emotion_scans').select('score, created_at').eq('user_id', userId).gte('created_at', startDate.toISOString()).order('created_at', { ascending: true }),
        supabase.from('coach_sessions').select('id, status, date').eq('user_id', userId).gte('date', startDate.toISOString()),
        supabase.from('user_badges').select('id').eq('user_id', userId),
      ]);

      const scans = scansResult.data || [];
      const sessions = sessionsResult.data || [];
      const badges = badgesResult.data || [];

      const avgScore = scans.length > 0
        ? Math.round(scans.reduce((s: number, r: any) => s + (r.score ?? 0), 0) / scans.length)
        : 0;

      const completedSessions = sessions.filter((s: any) => s.status === 'completed').length;

      setStats({
        emotionalScore: avgScore,
        emotionalScoreChange: 0,
        completedSessions,
        completedSessionsChange: 0,
        badgesEarned: badges.length,
        badgesEarnedChange: 0,
        progressPercentage: Math.min(100, Math.round((completedSessions / Math.max(1, days / 7)) * 100)),
        progressChange: 0,
      });

      const overviewMap = new Map<string, number[]>();
      for (const scan of scans) {
        const day = (scan as any).created_at?.split('T')[0] || 'unknown';
        const arr = overviewMap.get(day) || [];
        arr.push((scan as any).score ?? 0);
        overviewMap.set(day, arr);
      }

      setChartData({
        overview: Array.from(overviewMap.entries()).map(([date, scores]) => ({
          date,
          value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        })),
        emotions: [],
        progress: [],
      });
    } catch (err) {
      logger.error('Failed to load reporting data', { err }, 'reporting');
      setChartData({ overview: [], emotions: [], progress: [] });
      setStats(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (format: string): Promise<void> => {
    setIsLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user?.user?.id;

      const { data } = await supabase
        .from('emotion_scans')
        .select('score, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      const reportContent = JSON.stringify({ stats, scans: data || [], exportDate: new Date().toISOString() }, null, 2);
      const blob = new Blob([reportContent], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Rapport exporte avec succes",
        description: `Votre rapport a ete exporte au format ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch {
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation de votre rapport",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, stats]);

  return (
    <ReportingContext.Provider value={{
      stats,
      chartData,
      isLoading,
      loadData,
      exportReport
    }}>
      {children}
    </ReportingContext.Provider>
  );
};

export const useReporting = () => {
  const context = useContext(ReportingContext);
  if (context === undefined) {
    throw new Error('useReporting must be used within a ReportingProvider');
  }
  return context;
};
