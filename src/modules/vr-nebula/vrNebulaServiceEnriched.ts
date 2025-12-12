/**
 * VR Nebula Service ENRICHED - Business Logic & API
 * Version enrichie avec achievements, favoris, export et recommandations
 */

import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  VRNebulaSession,
  VRNebulaSessionSchema,
  CreateVRNebulaSession,
  CreateVRNebulaSessionSchema,
  CompleteVRNebulaSession,
  CompleteVRNebulaSessionSchema,
  VRNebulaStats,
  VRNebulaStatsSchema,
  calculateCoherenceScore,
  NebulaScene as VRNebulaScene,
  BreathingPattern,
} from './types';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const FAVORITES_KEY = 'vr-nebula-favorites';
const ACHIEVEMENTS_KEY = 'vr-nebula-achievements';
const LOCAL_HISTORY_KEY = 'vr-nebula-history';

// ─────────────────────────────────────────────────────────────
// TYPES ENRICHIS
// ─────────────────────────────────────────────────────────────

export interface VRNebulaFavorite {
  scene: VRNebulaScene;
  pattern: BreathingPattern;
  savedAt: string;
  notes?: string;
  rating?: number;
}

export interface VRNebulaAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: 'exploration' | 'mastery' | 'consistency' | 'wellness';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface VRNebulaRecommendation {
  scene: VRNebulaScene;
  pattern: BreathingPattern;
  duration: number;
  reason: string;
  confidence: number;
  basedOn: 'history' | 'time' | 'stress' | 'preference';
}

export interface EnrichedVRNebulaStats extends VRNebulaStats {
  achievements: VRNebulaAchievement[];
  favorites_count: number;
  scenes_explored: VRNebulaScene[];
  patterns_mastered: BreathingPattern[];
  best_coherence_score: number;
  avg_hrv_improvement: number;
  weekly_sessions: number;
  monthly_minutes: number;
  consistency_score: number;
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENT DEFINITIONS
// ─────────────────────────────────────────────────────────────

const ACHIEVEMENT_DEFINITIONS: Omit<VRNebulaAchievement, 'progress' | 'unlockedAt'>[] = [
  // Exploration
  { id: 'first_nebula', name: 'Premier Voyage', description: 'Première session VR Nebula', icon: '🚀', target: 1, category: 'exploration', rarity: 'common' },
  { id: 'all_scenes', name: 'Explorateur Galactique', description: 'Toutes les scènes visitées', icon: '🌌', target: 5, category: 'exploration', rarity: 'epic' },
  { id: 'all_patterns', name: 'Maître du Souffle', description: 'Tous les patterns maîtrisés', icon: '🌬️', target: 4, category: 'exploration', rarity: 'rare' },
  
  // Mastery
  { id: 'coherence_80', name: 'Cohérence Élevée', description: 'Score de cohérence > 80%', icon: '💎', target: 80, category: 'mastery', rarity: 'rare' },
  { id: 'coherence_95', name: 'Cohérence Parfaite', description: 'Score de cohérence > 95%', icon: '✨', target: 95, category: 'mastery', rarity: 'legendary' },
  { id: 'hrv_master', name: 'Maître HRV', description: 'Amélioration HRV +10', icon: '❤️', target: 10, category: 'mastery', rarity: 'epic' },
  
  // Consistency
  { id: 'streak_7', name: 'Semaine Stellaire', description: '7 jours consécutifs', icon: '⭐', target: 7, category: 'consistency', rarity: 'rare' },
  { id: 'streak_30', name: 'Mois Cosmique', description: '30 jours consécutifs', icon: '🌟', target: 30, category: 'consistency', rarity: 'epic' },
  { id: 'sessions_50', name: 'Voyageur Régulier', description: '50 sessions complétées', icon: '🛸', target: 50, category: 'consistency', rarity: 'rare' },
  
  // Wellness
  { id: 'total_hours_10', name: '10 Heures Zen', description: '10 heures de pratique', icon: '🧘', target: 600, category: 'wellness', rarity: 'rare' },
  { id: 'breaths_1000', name: 'Mille Souffles', description: '1000 cycles respiratoires', icon: '🌬️', target: 1000, category: 'wellness', rarity: 'epic' },
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

// ─────────────────────────────────────────────────────────────
// SESSION MANAGEMENT (from original + enhanced)
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateVRNebulaSession,
): Promise<VRNebulaSession> {
  try {
    const validated = CreateVRNebulaSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .insert({
        user_id: user.id,
        scene: validated.scene,
        breathing_pattern: validated.breathing_pattern,
        vr_mode: validated.vr_mode,
        duration_s: 0,
        cycles_completed: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return VRNebulaSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteVRNebulaSession,
): Promise<VRNebulaSession> {
  try {
    const validated = CompleteVRNebulaSessionSchema.parse(payload);

    let coherence_score: number | undefined;
    let rmssd_delta: number | undefined;

    if (validated.resp_rate_avg && validated.hrv_pre && validated.hrv_post) {
      rmssd_delta = validated.hrv_post - validated.hrv_pre;
      coherence_score = calculateCoherenceScore(validated.resp_rate_avg, rmssd_delta);
    }

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .update({
        duration_s: validated.duration_s,
        resp_rate_avg: validated.resp_rate_avg,
        hrv_pre: validated.hrv_pre,
        hrv_post: validated.hrv_post,
        rmssd_delta,
        coherence_score,
        cycles_completed: validated.cycles_completed,
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    // Update achievements after session
    await updateAchievements();

    // Save to local history
    const history = loadFromStorage<string[]>(LOCAL_HISTORY_KEY, []);
    saveToStorage(LOCAL_HISTORY_KEY, [...history, validated.session_id].slice(-50));

    return VRNebulaSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

export async function getSession(sessionId: string): Promise<VRNebulaSession> {
  try {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    return VRNebulaSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.getSession' } });
    throw err instanceof Error ? err : new Error('get_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// FAVORITES
// ─────────────────────────────────────────────────────────────

export function getFavorites(): VRNebulaFavorite[] {
  return loadFromStorage<VRNebulaFavorite[]>(FAVORITES_KEY, []);
}

export function addToFavorites(
  scene: VRNebulaScene,
  pattern: BreathingPattern,
  notes?: string,
  rating?: number
): VRNebulaFavorite {
  const favorites = getFavorites();
  const existing = favorites.find(f => f.scene === scene && f.pattern === pattern);
  
  if (existing) {
    throw new Error('already_favorited');
  }
  
  const favorite: VRNebulaFavorite = {
    scene,
    pattern,
    savedAt: new Date().toISOString(),
    notes,
    rating,
  };
  
  saveToStorage(FAVORITES_KEY, [...favorites, favorite]);
  return favorite;
}

export function removeFromFavorites(scene: VRNebulaScene, pattern: BreathingPattern): void {
  const favorites = getFavorites();
  saveToStorage(FAVORITES_KEY, favorites.filter(f => !(f.scene === scene && f.pattern === pattern)));
}

export function isFavorite(scene: VRNebulaScene, pattern: BreathingPattern): boolean {
  return getFavorites().some(f => f.scene === scene && f.pattern === pattern);
}

export function updateFavoriteRating(scene: VRNebulaScene, pattern: BreathingPattern, rating: number): void {
  const favorites = getFavorites();
  const updated = favorites.map(f => 
    (f.scene === scene && f.pattern === pattern) ? { ...f, rating } : f
  );
  saveToStorage(FAVORITES_KEY, updated);
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────

export function getAchievements(): VRNebulaAchievement[] {
  return loadFromStorage<VRNebulaAchievement[]>(ACHIEVEMENTS_KEY,
    ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a, progress: 0 }))
  );
}

export async function updateAchievements(): Promise<VRNebulaAchievement[]> {
  try {
    const stats = await getEnrichedStats();
    const achievements = getAchievements();
    const sessions = await getRecentSessions(100);
    
    const scenes = new Set(sessions.map(s => s.scene));
    const patterns = new Set(sessions.map(s => s.breathing_pattern));
    const totalBreaths = sessions.reduce((sum, s) => sum + (s.cycles_completed || 0), 0);
    const bestCoherence = Math.max(...sessions.map(s => s.coherence_score || 0), 0);
    const bestHRVDelta = Math.max(...sessions.map(s => s.rmssd_delta || 0), 0);
    
    const updated = achievements.map(achievement => {
      let progress = achievement.progress;
      
      switch (achievement.id) {
        case 'first_nebula':
          progress = sessions.length > 0 ? 1 : 0;
          break;
        case 'all_scenes':
          progress = scenes.size;
          break;
        case 'all_patterns':
          progress = patterns.size;
          break;
        case 'coherence_80':
        case 'coherence_95':
          progress = bestCoherence;
          break;
        case 'hrv_master':
          progress = bestHRVDelta;
          break;
        case 'streak_7':
        case 'streak_30':
          progress = stats.current_streak_days;
          break;
        case 'sessions_50':
          progress = stats.total_sessions;
          break;
        case 'total_hours_10':
          progress = stats.total_minutes;
          break;
        case 'breaths_1000':
          progress = totalBreaths;
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
  } catch (err) {
    console.error('Error updating achievements:', err);
    return getAchievements();
  }
}

// ─────────────────────────────────────────────────────────────
// RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────

export async function getRecommendations(options?: {
  stressLevel?: number;
  availableTime?: number;
}): Promise<VRNebulaRecommendation[]> {
  const stats = await getStats();
  const favorites = getFavorites();
  const recommendations: VRNebulaRecommendation[] = [];
  
  const hour = new Date().getHours();
  const availableTime = options?.availableTime || 10;
  
  // Time-based
  if (hour >= 6 && hour < 10) {
    recommendations.push({
      scene: 'sunrise' as VRNebulaScene,
      pattern: 'box',
      duration: Math.min(availableTime, 10),
      reason: 'Éveil en douceur avec la nébuleuse du lever de soleil',
      confidence: 0.85,
      basedOn: 'time',
    });
  } else if (hour >= 22 || hour < 6) {
    recommendations.push({
      scene: 'deep_space' as VRNebulaScene,
      pattern: 'coherence',
      duration: Math.min(availableTime, 15),
      reason: 'Relaxation profonde avant le sommeil',
      confidence: 0.9,
      basedOn: 'time',
    });
  }
  
  // Stress-based
  if (options?.stressLevel !== undefined) {
    if (options.stressLevel >= 7) {
      recommendations.push({
        scene: 'calm_waters' as VRNebulaScene,
        pattern: 'relax',
        duration: 15,
        reason: 'Pattern relaxant pour réduire le stress élevé',
        confidence: 0.95,
        basedOn: 'stress',
      });
    } else if (options.stressLevel >= 4) {
      recommendations.push({
        scene: 'aurora' as VRNebulaScene,
        pattern: 'coherence',
        duration: 10,
        reason: 'Cohérence cardiaque pour équilibrer le stress',
        confidence: 0.85,
        basedOn: 'stress',
      });
    }
  }
  
  // History-based - favorite combination
  if (stats.favorite_scene && stats.favorite_pattern) {
    recommendations.push({
      scene: stats.favorite_scene,
      pattern: stats.favorite_pattern,
      duration: Math.round(stats.total_minutes / Math.max(stats.total_sessions, 1)),
      reason: 'Votre combinaison préférée',
      confidence: 0.95,
      basedOn: 'history',
    });
  }
  
  // From favorites
  if (favorites.length > 0) {
    const topFav = favorites.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    recommendations.push({
      scene: topFav.scene,
      pattern: topFav.pattern,
      duration: 10,
      reason: 'Votre favori le mieux noté',
      confidence: 0.9,
      basedOn: 'preference',
    });
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
}

// ─────────────────────────────────────────────────────────────
// ENHANCED STATISTICS
// ─────────────────────────────────────────────────────────────

export async function getEnrichedStats(): Promise<EnrichedVRNebulaStats> {
  const baseStats = await getStats();
  const achievements = getAchievements();
  const favorites = getFavorites();
  const sessions = await getRecentSessions(100);
  
  const scenes_explored = Array.from(new Set(sessions.map(s => s.scene))) as VRNebulaScene[];
  const patterns_mastered = Array.from(new Set(sessions.map(s => s.breathing_pattern))) as BreathingPattern[];
  const best_coherence_score = Math.max(...sessions.map(s => s.coherence_score || 0), 0);
  
  const hrvDeltas = sessions.filter(s => s.rmssd_delta !== null).map(s => s.rmssd_delta!);
  const avg_hrv_improvement = hrvDeltas.length > 0
    ? hrvDeltas.reduce((sum, d) => sum + d, 0) / hrvDeltas.length
    : 0;
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const weekly_sessions = sessions.filter(s => new Date(s.created_at) >= weekAgo).length;
  const monthly_minutes = sessions
    .filter(s => new Date(s.created_at) >= monthAgo)
    .reduce((sum, s) => sum + (s.duration_s || 0), 0) / 60;
  
  // Consistency score (0-100)
  const expectedWeeklySessions = 7;
  const consistency_score = Math.min(100, (weekly_sessions / expectedWeeklySessions) * 100);
  
  return {
    ...baseStats,
    achievements,
    favorites_count: favorites.length,
    scenes_explored,
    patterns_mastered,
    best_coherence_score,
    avg_hrv_improvement,
    weekly_sessions,
    monthly_minutes,
    consistency_score,
  };
}

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

export async function exportUserData(): Promise<{
  stats: EnrichedVRNebulaStats;
  favorites: VRNebulaFavorite[];
  achievements: VRNebulaAchievement[];
  sessions: VRNebulaSession[];
  exportedAt: string;
}> {
  const stats = await getEnrichedStats();
  const favorites = getFavorites();
  const achievements = getAchievements();
  const sessions = await getRecentSessions(50);
  
  return {
    stats,
    favorites,
    achievements,
    sessions,
    exportedAt: new Date().toISOString(),
  };
}

export function downloadExport(data: Awaited<ReturnType<typeof exportUserData>>): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vr-nebula-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// ORIGINAL STATISTICS (kept for compatibility)
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<VRNebulaStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const sessions = data || [];

    const total_sessions = sessions.length;
    const total_minutes = sessions.reduce((sum, s) => sum + (s.duration_s || 0), 0) / 60;
    const total_breaths = sessions.reduce((sum, s) => sum + (s.cycles_completed || 0), 0);

    const sessionsWithCoherence = sessions.filter(s => s.coherence_score !== null);
    const average_coherence = sessionsWithCoherence.length > 0
      ? sessionsWithCoherence.reduce((sum, s) => sum + (s.coherence_score || 0), 0) / sessionsWithCoherence.length
      : 0;

    const sessionsWithHRV = sessions.filter(s => s.rmssd_delta !== null);
    const average_hrv_gain = sessionsWithHRV.length > 0
      ? sessionsWithHRV.reduce((sum, s) => sum + (s.rmssd_delta || 0), 0) / sessionsWithHRV.length
      : 0;

    const sceneCounts: Record<string, number> = {};
    sessions.forEach(s => {
      sceneCounts[s.scene] = (sceneCounts[s.scene] || 0) + 1;
    });
    const favorite_scene = Object.keys(sceneCounts).length > 0
      ? (Object.entries(sceneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as VRNebulaScene)
      : null;

    const patternCounts: Record<string, number> = {};
    sessions.forEach(s => {
      patternCounts[s.breathing_pattern] = (patternCounts[s.breathing_pattern] || 0) + 1;
    });
    const favorite_pattern = Object.keys(patternCounts).length > 0
      ? (Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as BreathingPattern)
      : null;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessions_this_week = sessions.filter(s => new Date(s.created_at) >= weekAgo).length;
    const sessions_this_month = sessions.filter(s => new Date(s.created_at) >= monthAgo).length;

    const longest_session_minutes = sessions.length > 0
      ? Math.max(...sessions.map(s => (s.duration_s || 0) / 60))
      : 0;

    const dates = sessions
      .map(s => new Date(s.created_at).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const uniqueDates = Array.from(new Set(dates));
    
    let current_streak_days = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      const today = new Date().toDateString();
      
      if (i === 0 && uniqueDates[0] !== today) break;
      
      const prev = i > 0 ? new Date(uniqueDates[i - 1]) : null;
      if (prev) {
        const diffDays = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays !== 1) break;
      }
      current_streak_days++;
    }

    return VRNebulaStatsSchema.parse({
      total_sessions,
      total_minutes,
      total_breaths,
      average_coherence,
      average_hrv_gain,
      favorite_scene,
      favorite_pattern,
      sessions_this_week,
      sessions_this_month,
      longest_session_minutes,
      current_streak_days,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<VRNebulaSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => VRNebulaSessionSchema.parse(row));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// UNIFIED SERVICE EXPORT
// ─────────────────────────────────────────────────────────────

export const vrNebulaServiceEnriched = {
  // Session
  createSession,
  completeSession,
  getSession,
  getRecentSessions,
  
  // Stats
  getStats,
  getEnrichedStats,
  
  // Favorites
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  updateFavoriteRating,
  
  // Achievements
  getAchievements,
  updateAchievements,
  
  // Recommendations
  getRecommendations,
  
  // Export
  exportUserData,
  downloadExport,
};
