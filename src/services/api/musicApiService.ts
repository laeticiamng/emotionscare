// @ts-nocheck
/**
 * Music API Service - Gestion complète de la musicothérapie IA
 *
 * Service unifié pour :
 * - Sessions musicales (CRUD)
 * - Playlists (création, gestion)
 * - Génération AI (Suno/MusicGen)
 * - Historique & Favoris
 * - Analytics musicales
 *
 * @version 1.0.0
 * @lastUpdated 2025-11-14
 */

import { MUSIC_ENDPOINTS, buildEndpoint } from './apiEndpoints';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface MusicSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  mood_before?: number;
  mood_after?: number;
  tracks_played: number;
  emotion_context?: string;
  metadata?: Record<string, any>;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  emotion_tag?: string;
  is_public: boolean;
  track_count: number;
  created_at: string;
  updated_at: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  artist?: string;
  duration_seconds: number;
  source: 'suno' | 'musicgen' | 'spotify' | 'library';
  url?: string;
  emotion_tags: string[];
  generation_params?: Record<string, any>;
}

export interface GenerationRequest {
  emotion: string;
  intensity?: number;
  style?: string;
  duration_seconds?: number;
  prompt?: string;
  model?: 'suno' | 'musicgen';
}

export interface GenerationResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  track?: Track;
  progress?: number;
  estimated_time?: number;
  error?: string;
}

export interface MusicPreferences {
  favorite_genres: string[];
  favorite_emotions: string[];
  preferred_model: 'suno' | 'musicgen';
  auto_queue: boolean;
  default_duration: number;
  volume_preference: number;
}

/**
 * Service API Musique
 */
class MusicApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
      }));
      logger.error('Music API error', error, 'musicApiService');
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * SESSIONS MUSICALES
   * ════════════════════════════════════════════════════════════════
   */

  async createSession(data: {
    emotion_context?: string;
    mood_before?: number;
    metadata?: Record<string, any>;
  }): Promise<MusicSession> {
    return this.request<MusicSession>(MUSIC_ENDPOINTS.CREATE_SESSION, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listSessions(filters?: {
    page?: number;
    limit?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<{
    sessions: MusicSession[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${MUSIC_ENDPOINTS.LIST_SESSIONS}?${queryString}`
      : MUSIC_ENDPOINTS.LIST_SESSIONS;

    return this.request(endpoint);
  }

  async getSession(sessionId: string): Promise<MusicSession> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.GET_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint);
  }

  async updateSession(
    sessionId: string,
    data: {
      mood_after?: number;
      tracks_played?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<MusicSession> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.UPDATE_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async completeSession(
    sessionId: string,
    data: {
      mood_after: number;
      tracks_played: number;
      satisfaction_score?: number;
    }
  ): Promise<MusicSession> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.COMPLETE_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.DELETE_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * PLAYLISTS
   * ════════════════════════════════════════════════════════════════
   */

  async listPlaylists(filters?: {
    emotion_tag?: string;
    is_public?: boolean;
  }): Promise<Playlist[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.emotion_tag) params.append('emotion_tag', filters.emotion_tag);
      if (filters.is_public !== undefined)
        params.append('is_public', String(filters.is_public));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${MUSIC_ENDPOINTS.LIST_PLAYLISTS}?${queryString}`
      : MUSIC_ENDPOINTS.LIST_PLAYLISTS;

    return this.request(endpoint);
  }

  async createPlaylist(data: {
    name: string;
    description?: string;
    emotion_tag?: string;
    is_public?: boolean;
  }): Promise<Playlist> {
    return this.request<Playlist>(MUSIC_ENDPOINTS.CREATE_PLAYLIST, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPlaylist(playlistId: string): Promise<Playlist> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.GET_PLAYLIST, {
      id: playlistId,
    });
    return this.request(endpoint);
  }

  async updatePlaylist(
    playlistId: string,
    data: {
      name?: string;
      description?: string;
      is_public?: boolean;
    }
  ): Promise<Playlist> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.UPDATE_PLAYLIST, {
      id: playlistId,
    });
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.DELETE_PLAYLIST, {
      id: playlistId,
    });
    return this.request(endpoint, { method: 'DELETE' });
  }

  async addTrackToPlaylist(
    playlistId: string,
    trackId: string
  ): Promise<Playlist> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.ADD_TRACK, {
      id: playlistId,
    });
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId }),
    });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * GÉNÉRATION AI (Suno/MusicGen)
   * ════════════════════════════════════════════════════════════════
   */

  async generateMusic(request: GenerationRequest): Promise<GenerationResult> {
    return this.request<GenerationResult>(MUSIC_ENDPOINTS.GENERATE_MUSIC, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async listGenerated(filters?: {
    emotion?: string;
    model?: 'suno' | 'musicgen';
    limit?: number;
  }): Promise<Track[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.emotion) params.append('emotion', filters.emotion);
      if (filters.model) params.append('model', filters.model);
      if (filters.limit) params.append('limit', String(filters.limit));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${MUSIC_ENDPOINTS.LIST_GENERATED}?${queryString}`
      : MUSIC_ENDPOINTS.LIST_GENERATED;

    return this.request(endpoint);
  }

  async getGenerated(trackId: string): Promise<Track> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.GET_GENERATED, {
      id: trackId,
    });
    return this.request(endpoint);
  }

  async deleteGenerated(trackId: string): Promise<void> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.DELETE_GENERATED, {
      id: trackId,
    });
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * FAVORIS
   * ════════════════════════════════════════════════════════════════
   */

  async listFavorites(): Promise<Track[]> {
    return this.request(MUSIC_ENDPOINTS.LIST_FAVORITES);
  }

  async addFavorite(trackId: string): Promise<void> {
    return this.request(MUSIC_ENDPOINTS.ADD_FAVORITE, {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId }),
    });
  }

  async removeFavorite(trackId: string): Promise<void> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.REMOVE_FAVORITE, {
      id: trackId,
    });
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * HISTORIQUE & LOGS
   * ════════════════════════════════════════════════════════════════
   */

  async getHistory(limit: number = 50): Promise<Array<{
    track: Track;
    played_at: string;
    duration_played: number;
    completed: boolean;
  }>> {
    return this.request(`${MUSIC_ENDPOINTS.GET_HISTORY}?limit=${limit}`);
  }

  async logPlay(trackId: string): Promise<void> {
    return this.request(MUSIC_ENDPOINTS.LOG_PLAY, {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId }),
    });
  }

  async logSkip(trackId: string, timestamp: number): Promise<void> {
    return this.request(MUSIC_ENDPOINTS.LOG_SKIP, {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId, timestamp }),
    });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * QUEUE DE GÉNÉRATION
   * ════════════════════════════════════════════════════════════════
   */

  async getQueue(): Promise<GenerationResult[]> {
    return this.request(MUSIC_ENDPOINTS.GET_QUEUE);
  }

  async getQueueStatus(generationId: string): Promise<GenerationResult> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.GET_QUEUE_STATUS, {
      id: generationId,
    });
    return this.request(endpoint);
  }

  async cancelGeneration(generationId: string): Promise<void> {
    const endpoint = buildEndpoint(MUSIC_ENDPOINTS.CANCEL_GENERATION, {
      id: generationId,
    });
    return this.request(endpoint, { method: 'POST' });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * RECOMMANDATIONS & PRÉFÉRENCES
   * ════════════════════════════════════════════════════════════════
   */

  async getRecommendations(emotion?: string): Promise<Track[]> {
    const params = emotion ? `?emotion=${encodeURIComponent(emotion)}` : '';
    return this.request(`${MUSIC_ENDPOINTS.GET_RECOMMENDATIONS}${params}`);
  }

  async getPreferences(): Promise<MusicPreferences> {
    return this.request(MUSIC_ENDPOINTS.GET_PREFERENCES);
  }

  async updatePreferences(preferences: Partial<MusicPreferences>): Promise<MusicPreferences> {
    return this.request(MUSIC_ENDPOINTS.UPDATE_PREFERENCES, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * ANALYTICS
   * ════════════════════════════════════════════════════════════════
   */

  async getAnalytics(): Promise<{
    total_sessions: number;
    total_tracks_played: number;
    total_listening_time: number;
    most_played_emotions: Array<{
      emotion: string;
      count: number;
    }>;
    mood_improvement_avg: number;
    favorite_models: Record<string, number>;
  }> {
    return this.request(MUSIC_ENDPOINTS.GET_ANALYTICS);
  }

  async getMusicProfile(): Promise<{
    musical_personality: string;
    favorite_emotions: string[];
    listening_patterns: Record<string, number>;
    generation_preferences: {
      model: 'suno' | 'musicgen';
      style: string;
      intensity: number;
    };
    recommendations: string[];
  }> {
    return this.request(MUSIC_ENDPOINTS.GET_PROFILE);
  }
}

/**
 * Instance singleton
 */
export const musicApiService = new MusicApiService();
export default musicApiService;
