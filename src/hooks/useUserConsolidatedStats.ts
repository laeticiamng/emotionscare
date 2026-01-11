/**
 * Hook pour les statistiques consolidées utilisateur
 * Agrège toutes les stats des différents modules
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface UserConsolidatedStats {
  totalSessions: number;
  totalMinutes: number;
  totalXp: number;
  currentLevel: number;
  levelProgress: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  moduleStats: {
    flashGlow: number;
    bubbleBeat: number;
    moodMixer: number;
    storySynth: number;
    bossGrit: number;
    breathwork: number;
    meditation: number;
    journal: number;
  };
  favoriteModule: string | null;
  weeklyProgress: {
    sessions: number;
    minutes: number;
    xp: number;
  };
}

const XP_PER_LEVEL = 500;

export function useUserConsolidatedStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserConsolidatedStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      return;
    }

    setIsLoading(true);

    try {
      // Try to get consolidated stats first
      const { data: consolidated, error } = await supabase
        .from('user_stats_consolidated')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (consolidated && !error) {
        const totalXp = consolidated.total_xp || 0;
        const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
        const levelProgress = ((totalXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

        setStats({
          totalSessions: consolidated.total_sessions || 0,
          totalMinutes: consolidated.total_minutes || 0,
          totalXp,
          currentLevel,
          levelProgress,
          currentStreak: consolidated.current_streak || 0,
          bestStreak: consolidated.best_streak || 0,
          lastActivityDate: consolidated.last_activity_date,
          moduleStats: {
            flashGlow: consolidated.flash_glow_sessions || 0,
            bubbleBeat: consolidated.bubble_beat_sessions || 0,
            moodMixer: consolidated.mood_mixer_sessions || 0,
            storySynth: consolidated.story_synth_sessions || 0,
            bossGrit: consolidated.boss_grit_sessions || 0,
            breathwork: consolidated.breathwork_sessions || 0,
            meditation: consolidated.meditation_sessions || 0,
            journal: consolidated.journal_entries || 0
          },
          favoriteModule: consolidated.favorite_module,
          weeklyProgress: {
            sessions: 0,
            minutes: 0,
            xp: 0
          }
        });
      } else {
        // Calculate from individual tables if consolidated doesn't exist
        await calculateFromSources();
      }
    } catch (error) {
      logger.error('Failed to fetch consolidated stats', error as Error, 'STATS');
      await calculateFromSources();
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const calculateFromSources = async () => {
    if (!user) return;

    try {
      // Fetch from all module tables in parallel
      const [flashGlow, bubbleBeat, moodMixer, storySynth, bossGrit] = await Promise.all([
        supabase.from('flash_glow_sessions').select('id, duration_seconds, score').eq('user_id', user.id),
        supabase.from('bubble_beat_sessions').select('id, duration_seconds, score').eq('user_id', user.id),
        supabase.from('mood_mixer_sessions').select('id, duration_seconds').eq('user_id', user.id),
        supabase.from('story_synth_sessions').select('id, reading_duration_seconds').eq('user_id', user.id),
        supabase.from('boss_grit_sessions').select('id, elapsed_seconds, xp_earned').eq('user_id', user.id)
      ]);

      const flashGlowSessions = flashGlow.data || [];
      const bubbleBeatSessions = bubbleBeat.data || [];
      const moodMixerSessions = moodMixer.data || [];
      const storySynthSessions = storySynth.data || [];
      const bossGritSessions = bossGrit.data || [];

      const totalSessions = 
        flashGlowSessions.length + 
        bubbleBeatSessions.length + 
        moodMixerSessions.length + 
        storySynthSessions.length + 
        bossGritSessions.length;

      const totalMinutes = Math.round((
        flashGlowSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) +
        bubbleBeatSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) +
        moodMixerSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) +
        storySynthSessions.reduce((sum, s) => sum + (s.reading_duration_seconds || 0), 0) +
        bossGritSessions.reduce((sum, s) => sum + (s.elapsed_seconds || 0), 0)
      ) / 60);

      const totalXp = 
        flashGlowSessions.reduce((sum, s) => sum + (s.score || 0), 0) +
        bubbleBeatSessions.reduce((sum, s) => sum + (s.score || 0), 0) +
        bossGritSessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0);

      const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
      const levelProgress = ((totalXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

      // Find favorite module
      const moduleCounts = {
        flashGlow: flashGlowSessions.length,
        bubbleBeat: bubbleBeatSessions.length,
        moodMixer: moodMixerSessions.length,
        storySynth: storySynthSessions.length,
        bossGrit: bossGritSessions.length
      };
      const favoriteModule = Object.entries(moduleCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      setStats({
        totalSessions,
        totalMinutes,
        totalXp,
        currentLevel,
        levelProgress,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        moduleStats: {
          flashGlow: flashGlowSessions.length,
          bubbleBeat: bubbleBeatSessions.length,
          moodMixer: moodMixerSessions.length,
          storySynth: storySynthSessions.length,
          bossGrit: bossGritSessions.length,
          breathwork: 0,
          meditation: 0,
          journal: 0
        },
        favoriteModule,
        weeklyProgress: {
          sessions: 0,
          minutes: 0,
          xp: 0
        }
      });

      // Save to consolidated table for future
      await supabase
        .from('user_stats_consolidated')
        .upsert({
          user_id: user.id,
          total_sessions: totalSessions,
          total_minutes: totalMinutes,
          total_xp: totalXp,
          current_level: currentLevel,
          flash_glow_sessions: flashGlowSessions.length,
          bubble_beat_sessions: bubbleBeatSessions.length,
          mood_mixer_sessions: moodMixerSessions.length,
          story_synth_sessions: storySynthSessions.length,
          boss_grit_sessions: bossGritSessions.length,
          favorite_module: favoriteModule,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

    } catch (error) {
      logger.error('Failed to calculate stats from sources', error as Error, 'STATS');
    }
  };

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    refreshStats
  };
}
