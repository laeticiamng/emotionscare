/**
 * Hook pour utiliser le service d'intégration des modules
 * Gère les XP, badges et synchronisation avec le leaderboard
 */

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getModuleConfig, moduleConfigs } from '@/services/moduleIntegration.service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ModuleSessionData {
  moduleType: string;
  durationSeconds: number;
  score?: number;
  completed: boolean;
  metadata?: Record<string, unknown>;
}

export function useModuleIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();

  const recordSession = useCallback(async (session: ModuleSessionData) => {
    if (!user) return { success: false, xp: 0 };
    
    try {
      const config = getModuleConfig(session.moduleType);
      const baseXp = Math.round((session.durationSeconds / 60) * (config?.pointsPerAction || 10));
      const completionBonus = session.completed ? 25 : 0;
      const scoreBonus = session.score || 0;
      const totalXp = baseXp + completionBonus + scoreBonus;

      // Get current stats
      const { data: existing } = await supabase
        .from('user_stats_consolidated')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const currentStats = existing || {
        total_xp: 0,
        total_sessions: 0,
        total_minutes: 0,
        current_streak: 0,
        best_streak: 0
      };

      // Calculate new values
      const newTotalXp = (currentStats.total_xp || 0) + totalXp;
      const newTotalSessions = (currentStats.total_sessions || 0) + 1;
      const newTotalMinutes = (currentStats.total_minutes || 0) + Math.round(session.durationSeconds / 60);
      const newLevel = Math.floor(newTotalXp / 500) + 1;

      // Update or insert stats
      const { error: statsError } = await supabase
        .from('user_stats_consolidated')
        .upsert({
          user_id: user.id,
          total_xp: newTotalXp,
          total_sessions: newTotalSessions,
          total_minutes: newTotalMinutes,
          current_level: newLevel,
          last_activity_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (statsError) {
        logger.error('Failed to update consolidated stats', statsError, 'MODULE_INTEGRATION');
      }

      // Update leaderboard
      const { data: leaderboardEntry } = await supabase
        .from('global_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (leaderboardEntry) {
        await supabase
          .from('global_leaderboard')
          .update({
            total_score: (leaderboardEntry.total_score || 0) + totalXp,
            weekly_score: (leaderboardEntry.weekly_score || 0) + totalXp,
            level: newLevel,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('global_leaderboard')
          .insert({
            user_id: user.id,
            display_name: 'Joueur',
            avatar_emoji: '✨',
            total_score: totalXp,
            weekly_score: totalXp,
            level: 1,
            streak_days: 0
          });
      }

      toast({
        title: '✨ Session terminée !',
        description: `+${totalXp} XP gagnés • Niveau ${newLevel}`,
      });

      return { success: true, xp: totalXp, level: newLevel };
    } catch (error) {
      logger.error('Failed to record module session', error as Error, 'MODULE_INTEGRATION');
      return { success: false, xp: 0 };
    }
  }, [user, toast]);

  const getModuleStats = useCallback(async () => {
    if (!user) return null;

    try {
      const { data } = await supabase
        .from('user_stats_consolidated')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return data;
    } catch {
      return null;
    }
  }, [user]);

  return { 
    recordSession, 
    getModuleConfig,
    getModuleStats,
    moduleConfigs 
  };
}
