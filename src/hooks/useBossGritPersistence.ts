/**
 * Hook pour la persistance des quêtes Boss Grit
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface BossGritQuest {
  id: string;
  quest_title: string;
  quest_description?: string;
  difficulty: string;
  xp_earned: number;
  tasks_completed: number;
  total_tasks: number;
  elapsed_seconds: number;
  success: boolean;
  completed_at?: string;
  created_at: string;
}

export interface BossGritStats {
  totalQuests: number;
  completedQuests: number;
  totalXP: number;
  averageXP: number;
  successRate: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  recentQuests: BossGritQuest[];
}

export function useBossGritPersistence() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<BossGritQuest[]>([]);
  const [stats, setStats] = useState<BossGritStats>({
    totalQuests: 0,
    completedQuests: 0,
    totalXP: 0,
    averageXP: 0,
    successRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    level: 1,
    recentQuests: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = (questList: BossGritQuest[]): BossGritStats => {
    const completed = questList.filter(q => q.success);
    const totalXP = completed.reduce((sum, q) => sum + q.xp_earned, 0);
    
    // Calculate streaks
    const successDates = completed
      .filter(q => q.completed_at)
      .map(q => q.completed_at!.split('T')[0])
      .sort()
      .reverse();
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let lastDate: string | null = null;

    for (const dateStr of successDates) {
      if (!lastDate) {
        const diff = Math.floor((new Date(today).getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
          tempStreak = 1;
          lastDate = dateStr;
        }
      } else {
        const diff = Math.floor((new Date(lastDate).getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          tempStreak++;
          lastDate = dateStr;
        } else {
          if (currentStreak === 0) currentStreak = tempStreak;
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
          lastDate = dateStr;
        }
      }
    }
    if (currentStreak === 0) currentStreak = tempStreak;
    bestStreak = Math.max(bestStreak, tempStreak);

    return {
      totalQuests: questList.length,
      completedQuests: completed.length,
      totalXP,
      averageXP: completed.length > 0 ? Math.round(totalXP / completed.length) : 0,
      successRate: questList.length > 0 ? Math.round((completed.length / questList.length) * 100) : 0,
      currentStreak,
      bestStreak,
      level: Math.floor(totalXP / 500) + 1,
      recentQuests: questList.slice(0, 10)
    };
  };

  const fetchQuests = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('boss_grit_quests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedQuests = (data || []) as BossGritQuest[];
      setQuests(typedQuests);
      setStats(calculateStats(typedQuests));
    } catch (error) {
      logger.error('Failed to fetch boss grit quests', error as Error, 'BOSS_GRIT');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveQuest = useCallback(async (quest: Omit<BossGritQuest, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('boss_grit_quests')
        .insert({
          user_id: user.id,
          quest_title: quest.quest_title,
          quest_description: quest.quest_description,
          difficulty: quest.difficulty,
          xp_earned: quest.xp_earned,
          tasks_completed: quest.tasks_completed,
          total_tasks: quest.total_tasks,
          elapsed_seconds: quest.elapsed_seconds,
          success: quest.success,
          completed_at: quest.completed_at
        })
        .select()
        .single();

      if (error) throw error;
      
      const newQuest = data as BossGritQuest;
      setQuests(prev => [newQuest, ...prev]);
      setStats(calculateStats([newQuest, ...quests]));
      
      return newQuest;
    } catch (error) {
      logger.error('Failed to save boss grit quest', error as Error, 'BOSS_GRIT');
      return null;
    }
  }, [user, quests]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    stats,
    isLoading,
    fetchQuests,
    saveQuest
  };
}
