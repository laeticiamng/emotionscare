/**
 * Service Suno Music API enrichi avec fallback et génération adaptative
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SunoGenerationRequest {
  prompt: string;
  style?: string;
  duration?: number;
  mood?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  instruments?: string[];
  vocals?: boolean;
  language?: string;
}

export interface SunoTrack {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  style: string;
  mood: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface SunoGenerationResult {
  success: boolean;
  tracks?: SunoTrack[];
  error?: string;
  source: 'suno' | 'fallback' | 'cache';
  generationTime?: number;
}

interface FallbackTrack {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  style: string;
  mood: string;
  tags: string[];
}

class SunoMusicServiceEnriched {
  private apiAvailable = true;
  private lastApiCheck = 0;
  private apiCheckInterval = 60000; // 1 minute
  private fallbackTracks: FallbackTrack[] = [];
  private cache: Map<string, SunoTrack[]> = new Map();
  private maxCacheSize = 50;
  private retryAttempts = 3;
  private retryDelay = 2000;

  constructor() {
    this.loadFallbackTracks();
    this.checkApiStatus();
  }

  /**
   * Charger les tracks de fallback
   */
  private async loadFallbackTracks(): Promise<void> {
    // Tracks de fallback intégrées
    this.fallbackTracks = [
      // Calme / Relaxation
      {
        id: 'fallback-calm-1',
        title: 'Peaceful Meditation',
        audioUrl: '/audio/fallback/peaceful-meditation.mp3',
        duration: 180,
        style: 'ambient',
        mood: 'calm',
        tags: ['meditation', 'relaxation', 'ambient'],
      },
      {
        id: 'fallback-calm-2',
        title: 'Ocean Waves',
        audioUrl: '/audio/fallback/ocean-waves.mp3',
        duration: 240,
        style: 'nature',
        mood: 'calm',
        tags: ['nature', 'water', 'relaxation'],
      },
      // Énergique
      {
        id: 'fallback-energy-1',
        title: 'Morning Energy',
        audioUrl: '/audio/fallback/morning-energy.mp3',
        duration: 150,
        style: 'upbeat',
        mood: 'energetic',
        tags: ['motivation', 'energy', 'upbeat'],
      },
      {
        id: 'fallback-energy-2',
        title: 'Positive Vibes',
        audioUrl: '/audio/fallback/positive-vibes.mp3',
        duration: 180,
        style: 'pop',
        mood: 'happy',
        tags: ['happy', 'positive', 'uplifting'],
      },
      // Focus
      {
        id: 'fallback-focus-1',
        title: 'Deep Focus',
        audioUrl: '/audio/fallback/deep-focus.mp3',
        duration: 300,
        style: 'lo-fi',
        mood: 'focused',
        tags: ['focus', 'study', 'concentration'],
      },
      {
        id: 'fallback-focus-2',
        title: 'Binaural Beats',
        audioUrl: '/audio/fallback/binaural-beats.mp3',
        duration: 360,
        style: 'binaural',
        mood: 'focused',
        tags: ['binaural', 'brainwaves', 'focus'],
      },
      // Sommeil
      {
        id: 'fallback-sleep-1',
        title: 'Sleep Sounds',
        audioUrl: '/audio/fallback/sleep-sounds.mp3',
        duration: 600,
        style: 'ambient',
        mood: 'sleepy',
        tags: ['sleep', 'night', 'rest'],
      },
      // Anxiété
      {
        id: 'fallback-anxiety-1',
        title: 'Anxiety Relief',
        audioUrl: '/audio/fallback/anxiety-relief.mp3',
        duration: 240,
        style: 'ambient',
        mood: 'calm',
        tags: ['anxiety', 'relief', 'calm'],
      },
    ];

    // Essayer de charger des tracks additionnelles depuis Supabase
    try {
      const { data } = await supabase
        .from('fallback_music_tracks' as any)
        .select('*');

      if (data && data.length > 0) {
        this.fallbackTracks = [...this.fallbackTracks, ...data];
        logger.info(`🎵 Loaded ${data.length} additional fallback tracks`, undefined, 'SUNO');
      }
    } catch {
      logger.debug('Using built-in fallback tracks only', undefined, 'SUNO');
    }
  }

  /**
   * Vérifier le statut de l'API Suno
   */
  private async checkApiStatus(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastApiCheck < this.apiCheckInterval) {
      return this.apiAvailable;
    }

    try {
      const { data, error } = await supabase.functions.invoke('suno-status', {
        body: { ping: true },
      });

      this.apiAvailable = !error && data?.status === 'ok';
      this.lastApiCheck = now;

      logger.info(`🎵 Suno API status: ${this.apiAvailable ? 'available' : 'unavailable'}`, undefined, 'SUNO');
    } catch {
      this.apiAvailable = false;
      this.lastApiCheck = now;
    }

    return this.apiAvailable;
  }

  /**
   * Générer de la musique avec Suno
   */
  async generate(request: SunoGenerationRequest): Promise<SunoGenerationResult> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(request);

    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      logger.info('🎵 Returning cached tracks', { cacheKey }, 'SUNO');
      return {
        success: true,
        tracks: cached,
        source: 'cache',
        generationTime: Date.now() - startTime,
      };
    }

    // Vérifier si l'API est disponible
    const apiAvailable = await this.checkApiStatus();

    if (apiAvailable) {
      // Essayer Suno avec retry
      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          const result = await this.callSunoApi(request);
          if (result.success && result.tracks) {
            // Mettre en cache
            this.addToCache(cacheKey, result.tracks);
            return {
              ...result,
              source: 'suno',
              generationTime: Date.now() - startTime,
            };
          }
        } catch (error) {
          logger.warn(`Suno API attempt ${attempt} failed`, undefined, 'SUNO');
          if (attempt < this.retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
          }
        }
      }
    }

    // Fallback vers les tracks pré-chargées
    logger.info('🎵 Using fallback tracks', undefined, 'SUNO');
    const fallbackResult = this.getFallbackTracks(request);

    return {
      success: true,
      tracks: fallbackResult,
      source: 'fallback',
      generationTime: Date.now() - startTime,
    };
  }

  /**
   * Appeler l'API Suno
   */
  private async callSunoApi(request: SunoGenerationRequest): Promise<SunoGenerationResult> {
    const { data, error } = await supabase.functions.invoke('suno-generate', {
      body: {
        prompt: this.buildPrompt(request),
        duration: request.duration ?? 120,
        style: request.style,
        make_instrumental: !request.vocals,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.tracks || data.tracks.length === 0) {
      throw new Error('No tracks returned from Suno');
    }

    const tracks: SunoTrack[] = data.tracks.map((track: any) => ({
      id: track.id,
      title: track.title || 'Generated Track',
      audioUrl: track.audio_url,
      duration: track.duration || request.duration || 120,
      style: request.style || 'ambient',
      mood: request.mood || 'neutral',
      createdAt: new Date(),
      metadata: track.metadata,
    }));

    return {
      success: true,
      tracks,
      source: 'suno',
    };
  }

  /**
   * Construire le prompt pour Suno
   */
  private buildPrompt(request: SunoGenerationRequest): string {
    let prompt = request.prompt;

    if (request.mood) {
      prompt += `, ${request.mood} mood`;
    }

    if (request.tempo) {
      const tempoMap = { slow: '60-80 BPM', medium: '100-120 BPM', fast: '140-160 BPM' };
      prompt += `, ${tempoMap[request.tempo]}`;
    }

    if (request.instruments && request.instruments.length > 0) {
      prompt += `, featuring ${request.instruments.join(', ')}`;
    }

    if (request.style) {
      prompt += `, ${request.style} style`;
    }

    return prompt;
  }

  /**
   * Obtenir des tracks de fallback correspondant à la requête
   */
  private getFallbackTracks(request: SunoGenerationRequest): SunoTrack[] {
    let matchingTracks = [...this.fallbackTracks];

    // Filtrer par mood
    if (request.mood) {
      const moodMatches = matchingTracks.filter(t => 
        t.mood === request.mood || t.tags.includes(request.mood!)
      );
      if (moodMatches.length > 0) {
        matchingTracks = moodMatches;
      }
    }

    // Filtrer par style
    if (request.style) {
      const styleMatches = matchingTracks.filter(t => 
        t.style === request.style || t.tags.includes(request.style!)
      );
      if (styleMatches.length > 0) {
        matchingTracks = styleMatches;
      }
    }

    // Filtrer par durée approximative
    if (request.duration) {
      matchingTracks.sort((a, b) => 
        Math.abs(a.duration - request.duration!) - Math.abs(b.duration - request.duration!)
      );
    }

    // Prendre les 2 meilleurs matches
    const selected = matchingTracks.slice(0, 2);

    return selected.map(track => ({
      id: track.id,
      title: track.title,
      audioUrl: track.audioUrl,
      duration: track.duration,
      style: track.style,
      mood: track.mood,
      createdAt: new Date(),
    }));
  }

  /**
   * Générer une clé de cache
   */
  private getCacheKey(request: SunoGenerationRequest): string {
    return `${request.mood}-${request.style}-${request.tempo}-${request.duration}`;
  }

  /**
   * Ajouter au cache
   */
  private addToCache(key: string, tracks: SunoTrack[]): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, tracks);
  }

  /**
   * Générer de la musique adaptée à l'émotion
   */
  async generateForEmotion(emotion: string, intensity: number): Promise<SunoGenerationResult> {
    const moodMap: Record<string, { mood: string; style: string; tempo: 'slow' | 'medium' | 'fast' }> = {
      joy: { mood: 'happy', style: 'upbeat', tempo: 'medium' },
      sadness: { mood: 'melancholic', style: 'piano', tempo: 'slow' },
      anger: { mood: 'intense', style: 'rock', tempo: 'fast' },
      fear: { mood: 'calm', style: 'ambient', tempo: 'slow' },
      surprise: { mood: 'excited', style: 'electronic', tempo: 'fast' },
      disgust: { mood: 'neutral', style: 'lo-fi', tempo: 'medium' },
      neutral: { mood: 'peaceful', style: 'ambient', tempo: 'medium' },
      anxious: { mood: 'calm', style: 'nature', tempo: 'slow' },
      stressed: { mood: 'relaxing', style: 'spa', tempo: 'slow' },
      tired: { mood: 'energetic', style: 'upbeat', tempo: 'medium' },
    };

    const config = moodMap[emotion.toLowerCase()] || moodMap.neutral;

    return this.generate({
      prompt: `Music for ${emotion} emotional state`,
      mood: config.mood,
      style: config.style,
      tempo: config.tempo,
      duration: intensity > 0.7 ? 300 : 180,
    });
  }

  /**
   * Générer une playlist thérapeutique
   */
  async generateTherapeuticPlaylist(
    targetMood: string,
    duration: number = 1800
  ): Promise<SunoTrack[]> {
    const tracks: SunoTrack[] = [];
    const trackDuration = 180;
    const trackCount = Math.ceil(duration / trackDuration);

    const moodProgression = this.getMoodProgression(targetMood, trackCount);

    for (const mood of moodProgression) {
      const result = await this.generate({
        prompt: `Therapeutic music transitioning to ${mood}`,
        mood,
        duration: trackDuration,
        vocals: false,
      });

      if (result.tracks) {
        tracks.push(...result.tracks);
      }
    }

    return tracks;
  }

  /**
   * Obtenir une progression de mood pour la thérapie
   */
  private getMoodProgression(targetMood: string, steps: number): string[] {
    const progressions: Record<string, string[]> = {
      calm: ['neutral', 'peaceful', 'calm', 'serene', 'tranquil'],
      energetic: ['neutral', 'positive', 'upbeat', 'energetic', 'powerful'],
      happy: ['neutral', 'content', 'cheerful', 'happy', 'joyful'],
      focused: ['calm', 'centered', 'focused', 'concentrated', 'flow'],
      sleepy: ['calm', 'relaxed', 'drowsy', 'sleepy', 'dreamy'],
    };

    const progression = progressions[targetMood] || progressions.calm;
    const result: string[] = [];

    for (let i = 0; i < steps; i++) {
      const index = Math.min(i, progression.length - 1);
      result.push(progression[index]);
    }

    return result;
  }

  /**
   * Vérifier si l'API est disponible
   */
  isApiAvailable(): boolean {
    return this.apiAvailable;
  }

  /**
   * Obtenir les statistiques
   */
  getStats(): {
    apiAvailable: boolean;
    cacheSize: number;
    fallbackTracksCount: number;
  } {
    return {
      apiAvailable: this.apiAvailable,
      cacheSize: this.cache.size,
      fallbackTracksCount: this.fallbackTracks.length,
    };
  }
}

export const sunoMusicService = new SunoMusicServiceEnriched();
export default sunoMusicService;
