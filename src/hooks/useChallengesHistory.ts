import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ChallengeHistoryEntry {
  id: string;
  challenge_id: string;
  user_id: string;
  completed: boolean;
  completed_at: string | null;
  streak_days: number;
  progress: {
    current: number;
    target: number;
  };
  challenge: {
    id: string;
    challenge_date: string;
    type: string;
    objective: string;
    reward_type: string;
    emotional_profile: string;
  };
}

export interface ChallengeStats {
  totalCompleted: number;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
  weeklyAverage: number;
  completionByType: Record<string, { completed: number; total: number }>;
  completionByProfile: Record<string, { completed: number; total: number }>;
}

export const useChallengesHistory = () => {
  const [history, setHistory] = useState<ChallengeHistoryEntry[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all user's challenge progress with challenge details
      const { data, error } = await supabase
        .from('user_challenges_progress')
        .select(`
          *,
          challenge:daily_challenges(*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const historyData = (data || []) as any[];
      setHistory(historyData);

      // Calculate stats
      calculateStats(historyData);
    } catch (error) {
      logger.error('Error fetching challenges history:', error, 'HOOK');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (historyData: any[]) => {
    const completed = historyData.filter(h => h.completed);
    const totalCompleted = completed.length;
    const completionRate = historyData.length > 0 
      ? (totalCompleted / historyData.length) * 100 
      : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedByDate = [...completed].sort((a, b) => 
      new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
    );

    if (sortedByDate.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      for (const entry of sortedByDate) {
        const completedDate = new Date(entry.completed_at!);
        completedDate.setHours(0, 0, 0, 0);
        
        if (completedDate.getTime() === checkDate.getTime()) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (completedDate.getTime() < checkDate.getTime()) {
          break;
        }
      }
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const entry of sortedByDate) {
      const completedDate = new Date(entry.completed_at!);
      completedDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        lastDate = completedDate;
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
        lastDate = completedDate;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    // Weekly average (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentCompleted = completed.filter(h => 
      new Date(h.completed_at!) >= fourWeeksAgo
    );
    const weeklyAverage = recentCompleted.length / 4;

    // Completion by type
    const completionByType: Record<string, { completed: number; total: number }> = {};
    historyData.forEach(h => {
      const type = h.challenge?.type || 'unknown';
      if (!completionByType[type]) {
        completionByType[type] = { completed: 0, total: 0 };
      }
      completionByType[type].total++;
      if (h.completed) {
        completionByType[type].completed++;
      }
    });

    // Completion by emotional profile
    const completionByProfile: Record<string, { completed: number; total: number }> = {};
    historyData.forEach(h => {
      const profile = h.challenge?.emotional_profile || 'unknown';
      if (!completionByProfile[profile]) {
        completionByProfile[profile] = { completed: 0, total: 0 };
      }
      completionByProfile[profile].total++;
      if (h.completed) {
        completionByProfile[profile].completed++;
      }
    });

    setStats({
      totalCompleted,
      completionRate,
      currentStreak,
      bestStreak,
      weeklyAverage,
      completionByType,
      completionByProfile,
    });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    stats,
    loading,
    refetch: fetchHistory,
  };
};
