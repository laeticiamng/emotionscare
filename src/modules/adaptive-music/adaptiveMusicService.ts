/**
 * Service pour le module Adaptive Music
 */

import type {
  AdaptiveMusicSession,
  AdaptiveMusicStats,
  AdaptiveMusicPreferences,
  PomsValues,
  AdaptiveMusicTrack,
} from './types';

export const AdaptiveMusicService = {
  /**
   * Créer une session
   */
  async createSession(
    userId: string,
    presetId: string,
    intensity: string,
    moodBefore?: number
  ): Promise<AdaptiveMusicSession> {
    const sessionData = {
      id: crypto.randomUUID(),
      user_id: userId,
      started_at: new Date().toISOString(),
      tracks_played: [],
      preset_id: presetId,
      intensity,
      mood_before: moodBefore,
      total_duration_seconds: 0,
    };

    // Store in localStorage for now (can be migrated to DB)
    const sessions = this.getLocalSessions(userId);
    sessions.push(sessionData);
    localStorage.setItem(`adaptive-music-sessions-${userId}`, JSON.stringify(sessions));

    return sessionData as AdaptiveMusicSession;
  },

  /**
   * Mettre à jour une session
   */
  async updateSession(
    sessionId: string,
    userId: string,
    updates: Partial<AdaptiveMusicSession>
  ): Promise<void> {
    const sessions = this.getLocalSessions(userId);
    const index = sessions.findIndex((s: any) => s.id === sessionId);
    if (index >= 0) {
      sessions[index] = { ...sessions[index], ...updates };
      localStorage.setItem(`adaptive-music-sessions-${userId}`, JSON.stringify(sessions));
    }
  },

  /**
   * Terminer une session
   */
  async completeSession(
    sessionId: string,
    userId: string,
    moodAfter?: number,
    pomsPost?: PomsValues
  ): Promise<void> {
    const sessions = this.getLocalSessions(userId);
    const session = sessions.find((s: any) => s.id === sessionId);
    
    if (session) {
      const startTime = new Date(session.started_at).getTime();
      const endTime = Date.now();
      const durationSeconds = Math.floor((endTime - startTime) / 1000);

      session.ended_at = new Date().toISOString();
      session.mood_after = moodAfter;
      session.poms_post = pomsPost;
      session.total_duration_seconds = durationSeconds;

      localStorage.setItem(`adaptive-music-sessions-${userId}`, JSON.stringify(sessions));
    }
  },

  /**
   * Ajouter un track joué
   */
  async addPlayedTrack(
    sessionId: string,
    userId: string,
    trackId: string
  ): Promise<void> {
    const sessions = this.getLocalSessions(userId);
    const session = sessions.find((s: any) => s.id === sessionId);
    
    if (session) {
      if (!session.tracks_played.includes(trackId)) {
        session.tracks_played.push(trackId);
        localStorage.setItem(`adaptive-music-sessions-${userId}`, JSON.stringify(sessions));
      }
    }
  },

  /**
   * Récupérer les sessions locales
   */
  getLocalSessions(userId: string): any[] {
    const stored = localStorage.getItem(`adaptive-music-sessions-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Récupérer les statistiques
   */
  async getStats(userId: string): Promise<AdaptiveMusicStats> {
    const sessions = this.getLocalSessions(userId);
    const completedSessions = sessions.filter((s: any) => s.ended_at);

    const totalSessions = completedSessions.length;
    const totalMinutes = completedSessions.reduce(
      (sum: number, s: any) => sum + (s.total_duration_seconds || 0) / 60,
      0
    );

    // Calculate mood improvement
    const sessionsWithMood = completedSessions.filter(
      (s: any) => s.mood_before !== undefined && s.mood_after !== undefined
    );
    const averageMoodImprovement = sessionsWithMood.length > 0
      ? sessionsWithMood.reduce(
          (sum: number, s: any) => sum + (s.mood_after - s.mood_before),
          0
        ) / sessionsWithMood.length
      : 0;

    // Find favorite preset
    const presetCount: Record<string, number> = {};
    completedSessions.forEach((s: any) => {
      presetCount[s.preset_id] = (presetCount[s.preset_id] || 0) + 1;
    });
    const favoritePreset = Object.entries(presetCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    // Calculate weekly trend
    const weeklyTrend: { date: string; minutes: number; sessions: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySessions = completedSessions.filter((s: any) => 
        s.ended_at?.startsWith(dateStr)
      );
      
      weeklyTrend.push({
        date: dateStr,
        minutes: daySessions.reduce((sum: number, s: any) => sum + (s.total_duration_seconds || 0) / 60, 0),
        sessions: daySessions.length,
      });
    }

    // Preset distribution
    const presetDistribution = presetCount;

    // Favorite tracks (most played)
    const trackCount: Record<string, number> = {};
    completedSessions.forEach((s: any) => {
      (s.tracks_played || []).forEach((t: string) => {
        trackCount[t] = (trackCount[t] || 0) + 1;
      });
    });
    const favoriteTracks = Object.entries(trackCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    return {
      totalSessions,
      totalMinutes: Math.round(totalMinutes),
      averageMoodImprovement: Math.round(averageMoodImprovement * 10) / 10,
      favoritePreset,
      favoriteTracks,
      weeklyTrend,
      presetDistribution,
    };
  },

  /**
   * Récupérer les préférences
   */
  async getPreferences(userId: string): Promise<AdaptiveMusicPreferences> {
    const stored = localStorage.getItem(`adaptive-music-prefs-${userId}`);
    if (stored) return JSON.parse(stored);

    return {
      preferInstrumental: true,
      preferredEnergy: 0.5,
      preferredValence: 0.5,
      excludedInstruments: [],
      preferredDuration: 20,
      autoAdvance: true,
    };
  },

  /**
   * Sauvegarder les préférences
   */
  async savePreferences(
    userId: string,
    preferences: Partial<AdaptiveMusicPreferences>
  ): Promise<void> {
    const current = await this.getPreferences(userId);
    const updated = { ...current, ...preferences };
    localStorage.setItem(`adaptive-music-prefs-${userId}`, JSON.stringify(updated));
  },

  /**
   * Ajouter un track aux favoris
   */
  async addFavorite(userId: string, track: AdaptiveMusicTrack): Promise<void> {
    const favorites = await this.getFavorites(userId);
    if (!favorites.find(t => t.id === track.id)) {
      favorites.push(track);
      localStorage.setItem(`adaptive-music-favorites-${userId}`, JSON.stringify(favorites));
    }
  },

  /**
   * Retirer un track des favoris
   */
  async removeFavorite(userId: string, trackId: string): Promise<void> {
    const favorites = await this.getFavorites(userId);
    const filtered = favorites.filter(t => t.id !== trackId);
    localStorage.setItem(`adaptive-music-favorites-${userId}`, JSON.stringify(filtered));
  },

  /**
   * Récupérer les favoris
   */
  async getFavorites(userId: string): Promise<AdaptiveMusicTrack[]> {
    const stored = localStorage.getItem(`adaptive-music-favorites-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Vérifier si un track est en favori
   */
  async isFavorite(userId: string, trackId: string): Promise<boolean> {
    const favorites = await this.getFavorites(userId);
    return favorites.some(t => t.id === trackId);
  },
};
