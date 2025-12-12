/**
 * Bubble Beat Service ENRICHED - Business Logic & API
 * Version enrichie avec leaderboard, achievements, power-ups et statistiques avancées
 */

import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  BubbleBeatSession,
  BubbleBeatSessionSchema,
  CreateBubbleBeatSession,
  CreateBubbleBeatSessionSchema,
  CompleteBubbleBeatSession,
  CompleteBubbleBeatSessionSchema,
  BubbleBeatStats,
  BubbleBeatStatsSchema,
  BubbleDifficulty,
  BubbleMood,
} from './types';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const ACHIEVEMENTS_KEY = 'bubble-beat-achievements';
const POWERUPS_KEY = 'bubble-beat-powerups';
const HIGH_SCORES_KEY = 'bubble-beat-highscores';
const LOCAL_HISTORY_KEY = 'bubble-beat-history';

// ─────────────────────────────────────────────────────────────
// TYPES ENRICHIS
// ─────────────────────────────────────────────────────────────

export interface BubbleBeatAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: 'score' | 'streak' | 'bubbles' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'slow_time' | 'double_points' | 'mega_pop' | 'shield' | 'combo_boost';
  duration: number;
  cooldown: number;
  unlocked: boolean;
  usesRemaining: number;
}

export interface HighScore {
  score: number;
  difficulty: BubbleDifficulty;
  date: string;
  bubblesPopped: number;
  maxCombo: number;
  duration: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username?: string;
  score: number;
  difficulty: BubbleDifficulty;
  date: string;
}

export interface EnrichedBubbleBeatStats extends BubbleBeatStats {
  achievements: BubbleBeatAchievement[];
  powerUps: PowerUp[];
  highScores: HighScore[];
  totalXP: number;
  level: number;
  perfectGames: number;
  maxCombo: number;
  favoriteMode: BubbleMood | null;
  weeklyPlaytime: number;
  improvementRate: number;
  unlockedPowerUps: number;
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENT DEFINITIONS
// ─────────────────────────────────────────────────────────────

const ACHIEVEMENT_DEFINITIONS: Omit<BubbleBeatAchievement, 'progress' | 'unlockedAt'>[] = [
  // Score achievements
  { id: 'score_100', name: 'Première Centaine', description: '100 points', icon: '💯', target: 100, category: 'score', rarity: 'common', xpReward: 10 },
  { id: 'score_500', name: 'Demi-Millier', description: '500 points en une partie', icon: '🎯', target: 500, category: 'score', rarity: 'rare', xpReward: 50 },
  { id: 'score_1000', name: 'Millionnaire', description: '1000 points en une partie', icon: '🏆', target: 1000, category: 'score', rarity: 'epic', xpReward: 100 },
  { id: 'score_5000', name: 'Légende', description: '5000 points en une partie', icon: '👑', target: 5000, category: 'score', rarity: 'legendary', xpReward: 500 },
  
  // Bubbles achievements
  { id: 'bubbles_50', name: 'Éclatant', description: '50 bulles éclatées', icon: '🫧', target: 50, category: 'bubbles', rarity: 'common', xpReward: 15 },
  { id: 'bubbles_500', name: 'Bulleur Pro', description: '500 bulles au total', icon: '✨', target: 500, category: 'bubbles', rarity: 'rare', xpReward: 75 },
  { id: 'bubbles_5000', name: 'Maître Bulleur', description: '5000 bulles au total', icon: '🌟', target: 5000, category: 'bubbles', rarity: 'epic', xpReward: 200 },
  
  // Streak achievements
  { id: 'combo_10', name: 'Combo Débutant', description: 'Combo de 10', icon: '🔥', target: 10, category: 'streak', rarity: 'common', xpReward: 20 },
  { id: 'combo_25', name: 'Combo Expert', description: 'Combo de 25', icon: '💥', target: 25, category: 'streak', rarity: 'rare', xpReward: 100 },
  { id: 'combo_50', name: 'Combo Légendaire', description: 'Combo de 50', icon: '⚡', target: 50, category: 'streak', rarity: 'legendary', xpReward: 300 },
  
  // Special achievements
  { id: 'perfect_game', name: 'Partie Parfaite', description: 'Aucune bulle manquée', icon: '💎', target: 1, category: 'special', rarity: 'epic', xpReward: 150 },
  { id: 'sessions_20', name: 'Joueur Régulier', description: '20 parties jouées', icon: '🎮', target: 20, category: 'special', rarity: 'rare', xpReward: 80 },
  { id: 'all_moods', name: 'Explorateur Émotionnel', description: 'Tous les modes humeur', icon: '🌈', target: 5, category: 'special', rarity: 'rare', xpReward: 100 },
];

// ─────────────────────────────────────────────────────────────
// POWERUP DEFINITIONS
// ─────────────────────────────────────────────────────────────

const POWERUP_DEFINITIONS: Omit<PowerUp, 'unlocked' | 'usesRemaining'>[] = [
  { id: 'slow_time', name: 'Ralenti', description: 'Ralentit le temps pendant 5s', icon: '⏱️', effect: 'slow_time', duration: 5, cooldown: 60 },
  { id: 'double_points', name: 'Double Points', description: 'Points doublés pendant 10s', icon: '✖️2️⃣', effect: 'double_points', duration: 10, cooldown: 90 },
  { id: 'mega_pop', name: 'Mega Pop', description: 'Éclate toutes les bulles', icon: '💥', effect: 'mega_pop', duration: 0, cooldown: 120 },
  { id: 'shield', name: 'Bouclier', description: 'Protège d\'une erreur', icon: '🛡️', effect: 'shield', duration: 15, cooldown: 90 },
  { id: 'combo_boost', name: 'Boost Combo', description: 'Combo x2 pendant 8s', icon: '🚀', effect: 'combo_boost', duration: 8, cooldown: 75 },
];

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// ─────────────────────────────────────────────────────────────
// SESSION MANAGEMENT
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateBubbleBeatSession,
): Promise<BubbleBeatSession> {
  try {
    const validated = CreateBubbleBeatSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .insert({
        user_id: user.id,
        difficulty: validated.difficulty,
        mood: validated.mood,
        score: 0,
        bubbles_popped: 0,
        duration_seconds: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return BubbleBeatSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteBubbleBeatSession & { maxCombo?: number; perfectGame?: boolean },
): Promise<BubbleBeatSession> {
  try {
    const validated = CompleteBubbleBeatSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .update({
        score: validated.score,
        bubbles_popped: validated.bubbles_popped,
        duration_seconds: validated.duration_seconds,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    const session = BubbleBeatSessionSchema.parse(data);

    // Update high scores
    updateHighScores({
      score: validated.score,
      difficulty: session.difficulty,
      date: new Date().toISOString(),
      bubblesPopped: validated.bubbles_popped,
      maxCombo: payload.maxCombo || 0,
      duration: validated.duration_seconds,
    });

    // Update achievements
    await updateAchievements(validated.score, validated.bubbles_popped, payload.maxCombo || 0, payload.perfectGame || false);

    return session;
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// HIGH SCORES
// ─────────────────────────────────────────────────────────────

export function getHighScores(): HighScore[] {
  return loadFromStorage<HighScore[]>(HIGH_SCORES_KEY, []);
}

function updateHighScores(newScore: HighScore): void {
  const highScores = getHighScores();
  const updated = [...highScores, newScore]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  saveToStorage(HIGH_SCORES_KEY, updated);
}

export function getPersonalBest(difficulty?: BubbleDifficulty): HighScore | null {
  const scores = getHighScores();
  const filtered = difficulty ? scores.filter(s => s.difficulty === difficulty) : scores;
  return filtered.length > 0 ? filtered[0] : null;
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────

export function getAchievements(): BubbleBeatAchievement[] {
  return loadFromStorage<BubbleBeatAchievement[]>(ACHIEVEMENTS_KEY,
    ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a, progress: 0 }))
  );
}

async function updateAchievements(
  score: number,
  bubbles: number,
  maxCombo: number,
  perfectGame: boolean
): Promise<BubbleBeatAchievement[]> {
  const achievements = getAchievements();
  const stats = await getStats();
  const sessions = await getRecentSessions(100);
  
  const moods = new Set(sessions.map(s => s.mood));
  
  const updated = achievements.map(achievement => {
    let progress = achievement.progress;
    
    switch (achievement.id) {
      case 'score_100':
      case 'score_500':
      case 'score_1000':
      case 'score_5000':
        progress = Math.max(progress, score);
        break;
      case 'bubbles_50':
      case 'bubbles_500':
      case 'bubbles_5000':
        progress = stats.total_bubbles_popped;
        break;
      case 'combo_10':
      case 'combo_25':
      case 'combo_50':
        progress = Math.max(progress, maxCombo);
        break;
      case 'perfect_game':
        if (perfectGame) progress = 1;
        break;
      case 'sessions_20':
        progress = stats.total_sessions;
        break;
      case 'all_moods':
        progress = moods.size;
        break;
    }
    
    const unlocked = progress >= achievement.target && !achievement.unlockedAt;
    
    return {
      ...achievement,
      progress,
      unlockedAt: unlocked ? new Date().toISOString() : achievement.unlockedAt,
    };
  });
  
  saveToStorage(ACHIEVEMENTS_KEY, updated);
  return updated;
}

export function getTotalXP(): number {
  const achievements = getAchievements();
  return achievements
    .filter(a => a.unlockedAt)
    .reduce((sum, a) => sum + a.xpReward, 0);
}

// ─────────────────────────────────────────────────────────────
// POWER-UPS
// ─────────────────────────────────────────────────────────────

export function getPowerUps(): PowerUp[] {
  const stored = loadFromStorage<PowerUp[]>(POWERUPS_KEY, []);
  
  if (stored.length === 0) {
    const initial = POWERUP_DEFINITIONS.map((p, i) => ({
      ...p,
      unlocked: i === 0, // First one unlocked by default
      usesRemaining: i === 0 ? 3 : 0,
    }));
    saveToStorage(POWERUPS_KEY, initial);
    return initial;
  }
  
  return stored;
}

export function usePowerUp(powerUpId: string): boolean {
  const powerUps = getPowerUps();
  const index = powerUps.findIndex(p => p.id === powerUpId);
  
  if (index === -1 || !powerUps[index].unlocked || powerUps[index].usesRemaining <= 0) {
    return false;
  }
  
  powerUps[index].usesRemaining--;
  saveToStorage(POWERUPS_KEY, powerUps);
  return true;
}

export function unlockPowerUp(powerUpId: string): void {
  const powerUps = getPowerUps();
  const index = powerUps.findIndex(p => p.id === powerUpId);
  
  if (index !== -1) {
    powerUps[index].unlocked = true;
    powerUps[index].usesRemaining = 3;
    saveToStorage(POWERUPS_KEY, powerUps);
  }
}

export function refillPowerUp(powerUpId: string, uses: number = 3): void {
  const powerUps = getPowerUps();
  const index = powerUps.findIndex(p => p.id === powerUpId);
  
  if (index !== -1 && powerUps[index].unlocked) {
    powerUps[index].usesRemaining += uses;
    saveToStorage(POWERUPS_KEY, powerUps);
  }
}

// ─────────────────────────────────────────────────────────────
// ENRICHED STATISTICS
// ─────────────────────────────────────────────────────────────

export async function getEnrichedStats(): Promise<EnrichedBubbleBeatStats> {
  const baseStats = await getStats();
  const achievements = getAchievements();
  const powerUps = getPowerUps();
  const highScores = getHighScores();
  const sessions = await getRecentSessions(100);
  
  const totalXP = getTotalXP();
  const level = calculateLevel(totalXP);
  
  // Perfect games count
  const perfectGames = 0; // Would need to track this in sessions
  
  // Max combo from high scores
  const maxCombo = Math.max(...highScores.map(s => s.maxCombo), 0);
  
  // Favorite mood
  const moodCounts: Record<string, number> = {};
  sessions.forEach(s => {
    moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
  });
  const favoriteMode = Object.entries(moodCounts).length > 0
    ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0] as BubbleMood
    : null;
  
  // Weekly playtime
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyPlaytime = sessions
    .filter(s => s.completed_at && new Date(s.completed_at) >= weekAgo)
    .reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
  
  // Improvement rate (comparing last 10 to previous 10)
  const completedSessions = sessions.filter(s => s.completed_at);
  const recent10 = completedSessions.slice(0, 10);
  const previous10 = completedSessions.slice(10, 20);
  
  const recentAvg = recent10.length > 0
    ? recent10.reduce((sum, s) => sum + (s.score || 0), 0) / recent10.length
    : 0;
  const previousAvg = previous10.length > 0
    ? previous10.reduce((sum, s) => sum + (s.score || 0), 0) / previous10.length
    : 0;
  
  const improvementRate = previousAvg > 0
    ? ((recentAvg - previousAvg) / previousAvg) * 100
    : 0;
  
  const unlockedPowerUps = powerUps.filter(p => p.unlocked).length;
  
  return {
    ...baseStats,
    achievements,
    powerUps,
    highScores,
    totalXP,
    level,
    perfectGames,
    maxCombo,
    favoriteMode,
    weeklyPlaytime,
    improvementRate,
    unlockedPowerUps,
  };
}

// ─────────────────────────────────────────────────────────────
// EXPORT DATA
// ─────────────────────────────────────────────────────────────

export async function exportUserData(): Promise<{
  stats: EnrichedBubbleBeatStats;
  achievements: BubbleBeatAchievement[];
  highScores: HighScore[];
  powerUps: PowerUp[];
  exportedAt: string;
}> {
  const stats = await getEnrichedStats();
  const achievements = getAchievements();
  const highScores = getHighScores();
  const powerUps = getPowerUps();
  
  return {
    stats,
    achievements,
    highScores,
    powerUps,
    exportedAt: new Date().toISOString(),
  };
}

export function downloadExport(data: Awaited<ReturnType<typeof exportUserData>>): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bubble-beat-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// ORIGINAL STATISTICS
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<BubbleBeatStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .select('score, bubbles_popped, duration_seconds')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null);

    if (error) throw error;

    const sessions = data || [];
    const total_sessions = sessions.length;
    const total_score = sessions.reduce((sum, s) => sum + (s.score || 0), 0);
    const total_bubbles_popped = sessions.reduce((sum, s) => sum + (s.bubbles_popped || 0), 0);
    const average_score = total_sessions > 0 ? total_score / total_sessions : 0;
    const best_score = sessions.length > 0 ? Math.max(...sessions.map(s => s.score || 0)) : 0;
    const total_playtime_minutes =
      sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;

    return BubbleBeatStatsSchema.parse({
      total_sessions,
      total_score,
      total_bubbles_popped,
      average_score,
      best_score,
      total_playtime_minutes,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<BubbleBeatSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => BubbleBeatSessionSchema.parse(row));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// UNIFIED SERVICE EXPORT
// ─────────────────────────────────────────────────────────────

export const bubbleBeatServiceEnriched = {
  // Session
  createSession,
  completeSession,
  getRecentSessions,
  
  // Stats
  getStats,
  getEnrichedStats,
  
  // High Scores
  getHighScores,
  getPersonalBest,
  
  // Achievements
  getAchievements,
  getTotalXP,
  
  // Power-ups
  getPowerUps,
  usePowerUp,
  unlockPowerUp,
  refillPowerUp,
  
  // Export
  exportUserData,
  downloadExport,
};
