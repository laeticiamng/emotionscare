/**
 * Hook pour la persistance des sessions Boss Grit dans Supabase
 * Utilise boss_grit_sessions pour les données de session
 * et boss_grit_quests pour les quêtes individuelles
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface BossGritSession {
  id: string;
  challenge_type: string;
  difficulty: string;
  elapsed_seconds: number;
  xp_earned: number;
  success: boolean;
  tasks_completed: number;
  total_tasks: number;
  created_at: string;
  completed_at?: string;
}

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
  totalSessions: number;
  totalQuests: number;
  completedQuests: number;
  totalXP: number;
  averageXP: number;
  successRate: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  totalMinutes: number;
  recentSessions: BossGritSession[];
}

export function useBossGritPersistence() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<BossGritSession[]>([]);
  const [quests, setQuests] = useState<BossGritQuest[]>([]);
  const [stats, setStats] = useState<BossGritStats>({
    totalSessions: 0,
    totalQuests: 0,
    completedQuests: 0,
    totalXP: 0,
    averageXP: 0,
    successRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    level: 1,
    totalMinutes: 0,
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = (sessionList: BossGritSession[], questList: BossGritQuest[]): BossGritStats => {
    const allItems = [...sessionList, ...questList];
    const completed = allItems.filter(q => q.success);
    const totalXP = completed.reduce((sum, q) => sum + (q.xp_earned || 0), 0);
    const totalMinutes = Math.round(allItems.reduce((sum, s) => sum + (s.elapsed_seconds || 0), 0) / 60);
    
    // Calculate streaks from sessions and quests
    const successDates = completed
      .filter(q => q.completed_at || q.created_at)
      .map(q => (q.completed_at || q.created_at).split('T')[0])
      .sort()
      .reverse();
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let lastDate: string | null = null;

    const uniqueDates = [...new Set(successDates)];
    for (const dateStr of uniqueDates) {
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
      totalSessions: sessionList.length,
      totalQuests: questList.length,
      completedQuests: completed.length,
      totalXP,
      averageXP: completed.length > 0 ? Math.round(totalXP / completed.length) : 0,
      successRate: allItems.length > 0 ? Math.round((completed.length / allItems.length) * 100) : 0,
      currentStreak,
      bestStreak,
      level: Math.floor(totalXP / 500) + 1,
      totalMinutes,
      recentSessions: sessionList.slice(0, 10)
    };
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch both sessions and quests in parallel
      const [sessionsRes, questsRes] = await Promise.all([
        supabase
          .from('boss_grit_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('boss_grit_quests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      if (sessionsRes.error) throw sessionsRes.error;
      if (questsRes.error) throw questsRes.error;

      const typedSessions = (sessionsRes.data || []) as BossGritSession[];
      const typedQuests = (questsRes.data || []) as BossGritQuest[];
      
      setSessions(typedSessions);
      setQuests(typedQuests);
      setStats(calculateStats(typedSessions, typedQuests));
    } catch (error) {
      logger.error('Failed to fetch boss grit data', error as Error, 'BOSS_GRIT');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSession = useCallback(async (session: Omit<BossGritSession, 'id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour sauvegarder vos sessions.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('boss_grit_sessions')
        .insert({
          user_id: user.id,
          challenge_type: session.challenge_type,
          difficulty: session.difficulty,
          elapsed_seconds: session.elapsed_seconds,
          xp_earned: session.xp_earned,
          success: session.success,
          tasks_completed: session.tasks_completed,
          total_tasks: session.total_tasks,
          completed_at: session.completed_at
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as BossGritSession;
      setSessions(prev => [newSession, ...prev]);
      setStats(calculateStats([newSession, ...sessions], quests));
      
      toast({
        title: session.success ? '⚔️ Défi réussi !' : '💪 Bon effort !',
        description: `+${session.xp_earned} XP gagnés`,
      });
      
      return newSession;
    } catch (error) {
      logger.error('Failed to save boss grit session', error as Error, 'BOSS_GRIT');
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la session.',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, sessions, quests, toast]);

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
      setStats(calculateStats(sessions, [newQuest, ...quests]));
      
      return newQuest;
    } catch (error) {
      logger.error('Failed to save boss grit quest', error as Error, 'BOSS_GRIT');
      return null;
    }
  }, [user, sessions, quests]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sessions,
    quests,
    stats,
    isLoading,
    fetchData,
    saveSession,
    saveQuest
  };
}
