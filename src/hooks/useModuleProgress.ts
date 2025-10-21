// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface ModuleProgress {
  id?: string;
  user_id?: string;
  module_name: string;
  progress_data: Record<string, any>;
  total_points: number;
  level: number;
  streak: number;
  completed_count: number;
  last_activity_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleSession {
  id?: string;
  user_id?: string;
  module_name: string;
  session_data: Record<string, any>;
  duration_seconds: number;
  score: number;
  completed: boolean;
  started_at?: string;
  ended_at?: string;
}

export interface UserAchievement {
  id?: string;
  user_id?: string;
  module_name: string;
  achievement_type: string;
  achievement_data: Record<string, any>;
  unlocked_at?: string;
}

export const useModuleProgress = (moduleName: string) => {
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [sessions, setSessions] = useState<ModuleSession[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const { toast } = useToast();

  // Load progress from database
  const loadProgress = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_name', moduleName)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProgress(data);
      } else {
        // Create initial progress
        const { data: newProgress, error: insertError } = await supabase
          .from('module_progress')
          .insert({
            user_id: user.id,
            module_name: moduleName,
            progress_data: {},
            total_points: 0,
            level: 1,
            streak: 0,
            completed_count: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setProgress(newProgress);
      }
    } catch (error) {
      logger.error('Error loading progress', error as Error, 'SYSTEM');
    } finally {
      setIsLoading(false);
    }
  }, [moduleName]);

  // Load sessions
  const loadSessions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('module_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_name', moduleName)
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      logger.error('Error loading sessions', error as Error, 'SYSTEM');
    }
  }, [moduleName]);

  // Load achievements
  const loadAchievements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_name', moduleName);

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      logger.error('Error loading achievements', error as Error, 'SYSTEM');
    }
  }, [moduleName]);

  // Update progress
  const updateProgress = useCallback(async (updates: Partial<ModuleProgress>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !progress) return;

      const { error } = await supabase
        .from('module_progress')
        .update({
          ...updates,
          last_activity_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('module_name', moduleName);

      if (error) throw error;

      setProgress(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      logger.error('Error updating progress', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la progression',
        variant: 'destructive'
      });
    }
  }, [moduleName, progress, toast]);

  // Start session
  const startSession = useCallback(async (sessionData: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('module_sessions')
        .insert({
          user_id: user.id,
          module_name: moduleName,
          session_data: sessionData,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentSession(data.id);
      return data.id;
    } catch (error) {
      logger.error('Error starting session', error as Error, 'SYSTEM');
      return null;
    }
  }, [moduleName]);

  // End session
  const endSession = useCallback(async (
    sessionId: string,
    score: number,
    durationSeconds: number,
    completed: boolean = true
  ) => {
    try {
      const { error } = await supabase
        .from('module_sessions')
        .update({
          score,
          duration_seconds: durationSeconds,
          completed,
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      setCurrentSession(null);
      await loadSessions();
    } catch (error) {
      logger.error('Error ending session', error as Error, 'SYSTEM');
    }
  }, [loadSessions]);

  // Unlock achievement
  const unlockAchievement = useCallback(async (
    achievementType: string,
    achievementData: Record<string, any> = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already unlocked
      const exists = achievements.some(a => a.achievement_type === achievementType);
      if (exists) return;

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          module_name: moduleName,
          achievement_type: achievementType,
          achievement_data: achievementData
        });

      if (error) throw error;

      await loadAchievements();

      toast({
        title: '🏆 Achievement Débloqué!',
        description: achievementData.title || achievementType,
      });
    } catch (error) {
      logger.error('Error unlocking achievement', error as Error, 'ANALYTICS');
    }
  }, [moduleName, achievements, loadAchievements, toast]);

  // Add points
  const addPoints = useCallback(async (points: number) => {
    if (!progress) return;

    const newTotalPoints = progress.total_points + points;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;

    await updateProgress({
      total_points: newTotalPoints,
      level: newLevel
    });
  }, [progress, updateProgress]);

  // Increment streak
  const incrementStreak = useCallback(async () => {
    if (!progress) return;
    
    await updateProgress({
      streak: progress.streak + 1
    });
  }, [progress, updateProgress]);

  // Reset streak
  const resetStreak = useCallback(async () => {
    await updateProgress({
      streak: 0
    });
  }, [updateProgress]);

  // Increment completed count
  const incrementCompleted = useCallback(async () => {
    if (!progress) return;
    
    await updateProgress({
      completed_count: progress.completed_count + 1
    });
  }, [progress, updateProgress]);

  // Update progress data
  const updateProgressData = useCallback(async (data: Record<string, any>) => {
    if (!progress) return;
    
    await updateProgress({
      progress_data: { ...progress.progress_data, ...data }
    });
  }, [progress, updateProgress]);

  useEffect(() => {
    loadProgress();
    loadSessions();
    loadAchievements();
  }, [loadProgress, loadSessions, loadAchievements]);

  return {
    progress,
    sessions,
    achievements,
    isLoading,
    currentSession,
    updateProgress,
    updateProgressData,
    startSession,
    endSession,
    unlockAchievement,
    addPoints,
    incrementStreak,
    resetStreak,
    incrementCompleted,
    reload: () => {
      loadProgress();
      loadSessions();
      loadAchievements();
    }
  };
};

// Hook pour obtenir les statistiques globales de l'utilisateur
export const useUserOverallStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc('get_user_overall_stats', { p_user_id: user.id });

      if (error) throw error;
      setStats(data);
    } catch (error) {
      logger.error('Error loading overall stats', error as Error, 'ANALYTICS');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    reload: loadStats
  };
};
