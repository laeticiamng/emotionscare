/**
 * BossGritService ENRICHED - Service Boss Grit complet
 * Version enrichie avec Supabase persistence
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { BounceBattle, CopingResponse, BattleMode, BounceEventType, BounceEventData } from './types';

const ACHIEVEMENTS_KEY = 'boss-grit-achievements';
const STATS_KEY = 'boss-grit-stats';

interface BossGritAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

interface BossGritStats {
  totalBattles: number;
  totalWins: number;
  winStreak: number;
  longestStreak: number;
  totalDuration: number;
  averageDuration: number;
  favoriteMode: string;
  copingScoreAvg: number;
}

const defaultAchievements: BossGritAchievement[] = [
  { id: 'first_battle', name: 'Premier combat', description: 'Complétez votre première bataille', icon: '⚔️', progress: 0, target: 1 },
  { id: 'streak_5', name: 'Combattant', description: 'Gagnez 5 batailles d\'affilée', icon: '🔥', progress: 0, target: 5 },
  { id: 'battles_20', name: 'Vétéran', description: 'Complétez 20 batailles', icon: '🏅', progress: 0, target: 20 },
  { id: 'master', name: 'Maître Grit', description: 'Atteignez un score de coping de 90%', icon: '👑', progress: 0, target: 90 },
];

async function getAchievementsFromSupabase(userId: string): Promise<BossGritAchievement[]> {
  try {
    const { data } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', userId)
      .eq('key', 'boss_grit_achievements')
      .maybeSingle();
    
    if (data?.value) {
      const saved = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      return defaultAchievements.map(def => {
        const found = saved.find((s: BossGritAchievement) => s.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    }
  } catch (error) {
    logger.error('Failed to load boss grit achievements', error as Error, 'BOSSGRIT');
  }
  
  // Fallback localStorage
  try {
    const saved = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]');
    return defaultAchievements.map(def => {
      const found = saved.find((s: BossGritAchievement) => s.id === def.id);
      return found ? { ...def, ...found } : def;
    });
  } catch { return defaultAchievements; }
}

async function getStatsFromSupabase(userId: string): Promise<BossGritStats> {
  const defaultStats = { totalBattles: 0, totalWins: 0, winStreak: 0, longestStreak: 0, totalDuration: 0, averageDuration: 0, favoriteMode: '', copingScoreAvg: 0 };
  
  try {
    const { data } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', userId)
      .eq('key', 'boss_grit_stats')
      .maybeSingle();
    
    if (data?.value) {
      return typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    }
  } catch (error) {
    logger.error('Failed to load boss grit stats', error as Error, 'BOSSGRIT');
  }
  
  // Fallback localStorage
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}') || defaultStats;
  } catch { return defaultStats; }
}

function getAchievements(): BossGritAchievement[] {
  try {
    const saved = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]');
    return defaultAchievements.map(def => {
      const found = saved.find((s: BossGritAchievement) => s.id === def.id);
      return found ? { ...def, ...found } : def;
    });
  } catch { return defaultAchievements; }
}

function getStats(): BossGritStats {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch {
    return { totalBattles: 0, totalWins: 0, winStreak: 0, longestStreak: 0, totalDuration: 0, averageDuration: 0, favoriteMode: '', copingScoreAvg: 0 };
  }
}

export class BossGritServiceEnriched {
  static async createBattle(userId: string, mode: BattleMode = 'standard'): Promise<BounceBattle> {
    const { data, error } = await supabase.from('bounce_battles').insert({ user_id: userId, mode, status: 'created' }).select().single();
    if (error) throw error;
    return data;
  }

  static async startBattle(battleId: string): Promise<void> {
    const { error } = await supabase.from('bounce_battles').update({ status: 'in_progress', started_at: new Date().toISOString() }).eq('id', battleId);
    if (error) throw error;
  }

  static async completeBattle(battleId: string, durationSeconds: number, won: boolean = true, userId?: string): Promise<void> {
    const { error } = await supabase.from('bounce_battles').update({ status: 'completed', duration_seconds: durationSeconds, ended_at: new Date().toISOString() }).eq('id', battleId);
    if (error) throw error;

    const stats = getStats();
    stats.totalBattles++;
    stats.totalDuration += durationSeconds;
    stats.averageDuration = stats.totalDuration / stats.totalBattles;
    if (won) {
      stats.totalWins++;
      stats.winStreak++;
      stats.longestStreak = Math.max(stats.longestStreak, stats.winStreak);
    } else {
      stats.winStreak = 0;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    this.updateAchievements(stats);

    // Sync to Supabase if userId provided
    if (userId) {
      await supabase.from('user_settings').upsert({
        user_id: userId,
        key: 'boss_grit_stats',
        value: JSON.stringify(stats),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,key' });
    }
  }

  static async fetchHistory(userId: string, limit: number = 20): Promise<BounceBattle[]> {
    const { data, error } = await supabase.from('bounce_battles').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  }

  static async getLeaderboard(limit: number = 10): Promise<{ rank: number; name: string; wins: number; streak: number }[]> {
    const { data } = await supabase.from('bounce_battles').select('user_id').eq('status', 'completed');
    const wins = new Map<string, number>();
    data?.forEach(b => wins.set(b.user_id, (wins.get(b.user_id) || 0) + 1));
    return Array.from(wins.entries()).map(([id, w], i) => ({ rank: i + 1, name: `Joueur ${id.slice(0, 4)}`, wins: w, streak: 0 })).sort((a, b) => b.wins - a.wins).slice(0, limit);
  }

  static getAchievements(): BossGritAchievement[] { return getAchievements(); }
  static getStats(): BossGritStats { return getStats(); }
  static async getAchievementsAsync(userId: string): Promise<BossGritAchievement[]> { return getAchievementsFromSupabase(userId); }
  static async getStatsAsync(userId: string): Promise<BossGritStats> { return getStatsFromSupabase(userId); }

  private static async updateAchievements(stats: BossGritStats, userId?: string): Promise<void> {
    const achievements = getAchievements().map(a => {
      if (a.id === 'first_battle') a.progress = Math.min(stats.totalBattles, 1);
      if (a.id === 'streak_5') a.progress = stats.winStreak;
      if (a.id === 'battles_20') a.progress = stats.totalBattles;
      if (a.progress >= a.target && !a.unlockedAt) a.unlockedAt = new Date().toISOString();
      return a;
    });
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));

    if (userId) {
      await supabase.from('user_settings').upsert({
        user_id: userId,
        key: 'boss_grit_achievements',
        value: JSON.stringify(achievements),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,key' });
    }
  }

  static exportData(): { stats: BossGritStats; achievements: BossGritAchievement[]; exportedAt: string } {
    return { stats: getStats(), achievements: getAchievements(), exportedAt: new Date().toISOString() };
  }
}
