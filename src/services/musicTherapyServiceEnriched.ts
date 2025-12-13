/**
 * Music Therapy Service Enriched - Service complet pour la musicothérapie
 * Génération musicale adaptative, playlists thérapeutiques, et analyse d'impact
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type MoodTarget = 
  | 'relaxation' | 'focus' | 'energy' | 'sleep' 
  | 'anxiety-relief' | 'motivation' | 'creativity' | 'meditation';

export type MusicGenre = 
  | 'ambient' | 'classical' | 'lo-fi' | 'nature' 
  | 'binaural' | 'electronic' | 'acoustic' | 'world';

export interface MusicSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  moodTarget: MoodTarget;
  moodBefore: number;
  moodAfter: number | null;
  playlist: TherapeuticTrack[];
  currentTrackIndex: number;
  effectiveness: number | null;
  notes: string | null;
}

export interface TherapeuticTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  genre: MusicGenre;
  bpm: number;
  energy: number; // 0-1
  valence: number; // 0-1 (positivity)
  therapeuticProperties: TherapeuticProperty[];
  audioUrl: string;
  imageUrl?: string;
  isGenerated: boolean;
}

export interface TherapeuticProperty {
  property: string;
  strength: number; // 0-1
}

export interface MusicPreferences {
  favoriteGenres: MusicGenre[];
  dislikedGenres: MusicGenre[];
  preferredBpmRange: { min: number; max: number };
  instrumentPreferences: string[];
  therapyGoals: MoodTarget[];
  sessionDuration: number; // preferred minutes
}

export interface PlaylistConfig {
  moodTarget: MoodTarget;
  duration: number; // minutes
  startEnergy: number; // 0-1
  endEnergy: number; // 0-1
  genres?: MusicGenre[];
  bpmRange?: { min: number; max: number };
  includeNature?: boolean;
  includeBinaural?: boolean;
}

export interface MusicAnalytics {
  totalListeningTime: number; // minutes
  sessionsCount: number;
  averageEffectiveness: number;
  moodImprovementRate: number;
  favoriteGenre: MusicGenre;
  bestTimeOfDay: string;
  streakDays: number;
  topTracks: TherapeuticTrack[];
}

// Bibliothèque de pistes thérapeutiques par défaut
const DEFAULT_TRACKS: Record<MoodTarget, TherapeuticTrack[]> = {
  relaxation: [
    {
      id: 'relax-1',
      title: 'Vagues de Sérénité',
      artist: 'EmotionsCare',
      duration: 300,
      genre: 'ambient',
      bpm: 60,
      energy: 0.2,
      valence: 0.6,
      therapeuticProperties: [
        { property: 'stress-reduction', strength: 0.9 },
        { property: 'muscle-relaxation', strength: 0.8 },
      ],
      audioUrl: '/audio/therapy/relaxation-1.mp3',
      isGenerated: false,
    },
    {
      id: 'relax-2',
      title: 'Forêt Paisible',
      artist: 'EmotionsCare',
      duration: 420,
      genre: 'nature',
      bpm: 50,
      energy: 0.15,
      valence: 0.7,
      therapeuticProperties: [
        { property: 'anxiety-relief', strength: 0.85 },
        { property: 'grounding', strength: 0.75 },
      ],
      audioUrl: '/audio/therapy/forest-peace.mp3',
      isGenerated: false,
    },
  ],
  focus: [
    {
      id: 'focus-1',
      title: 'Concentration Alpha',
      artist: 'EmotionsCare',
      duration: 600,
      genre: 'binaural',
      bpm: 70,
      energy: 0.4,
      valence: 0.5,
      therapeuticProperties: [
        { property: 'focus-enhancement', strength: 0.9 },
        { property: 'cognitive-boost', strength: 0.85 },
      ],
      audioUrl: '/audio/therapy/alpha-focus.mp3',
      isGenerated: false,
    },
    {
      id: 'focus-2',
      title: 'Lo-Fi Study Session',
      artist: 'EmotionsCare',
      duration: 480,
      genre: 'lo-fi',
      bpm: 85,
      energy: 0.45,
      valence: 0.6,
      therapeuticProperties: [
        { property: 'productivity', strength: 0.8 },
        { property: 'calm-alertness', strength: 0.75 },
      ],
      audioUrl: '/audio/therapy/lofi-study.mp3',
      isGenerated: false,
    },
  ],
  energy: [
    {
      id: 'energy-1',
      title: 'Morning Boost',
      artist: 'EmotionsCare',
      duration: 240,
      genre: 'electronic',
      bpm: 120,
      energy: 0.8,
      valence: 0.85,
      therapeuticProperties: [
        { property: 'energy-boost', strength: 0.9 },
        { property: 'motivation', strength: 0.85 },
      ],
      audioUrl: '/audio/therapy/morning-boost.mp3',
      isGenerated: false,
    },
  ],
  sleep: [
    {
      id: 'sleep-1',
      title: 'Rêves Profonds',
      artist: 'EmotionsCare',
      duration: 1800,
      genre: 'ambient',
      bpm: 40,
      energy: 0.1,
      valence: 0.5,
      therapeuticProperties: [
        { property: 'sleep-induction', strength: 0.95 },
        { property: 'deep-relaxation', strength: 0.9 },
      ],
      audioUrl: '/audio/therapy/deep-dreams.mp3',
      isGenerated: false,
    },
    {
      id: 'sleep-2',
      title: 'Delta Waves',
      artist: 'EmotionsCare',
      duration: 2400,
      genre: 'binaural',
      bpm: 30,
      energy: 0.05,
      valence: 0.4,
      therapeuticProperties: [
        { property: 'delta-brainwaves', strength: 0.9 },
        { property: 'restorative-sleep', strength: 0.85 },
      ],
      audioUrl: '/audio/therapy/delta-waves.mp3',
      isGenerated: false,
    },
  ],
  'anxiety-relief': [
    {
      id: 'anxiety-1',
      title: 'Calme Intérieur',
      artist: 'EmotionsCare',
      duration: 360,
      genre: 'acoustic',
      bpm: 55,
      energy: 0.25,
      valence: 0.65,
      therapeuticProperties: [
        { property: 'anxiety-relief', strength: 0.9 },
        { property: 'heart-rate-reduction', strength: 0.8 },
      ],
      audioUrl: '/audio/therapy/inner-calm.mp3',
      isGenerated: false,
    },
  ],
  motivation: [
    {
      id: 'motivation-1',
      title: 'Rise Up',
      artist: 'EmotionsCare',
      duration: 300,
      genre: 'electronic',
      bpm: 110,
      energy: 0.75,
      valence: 0.9,
      therapeuticProperties: [
        { property: 'motivation', strength: 0.9 },
        { property: 'confidence', strength: 0.85 },
      ],
      audioUrl: '/audio/therapy/rise-up.mp3',
      isGenerated: false,
    },
  ],
  creativity: [
    {
      id: 'creativity-1',
      title: 'Flux Créatif',
      artist: 'EmotionsCare',
      duration: 480,
      genre: 'world',
      bpm: 90,
      energy: 0.5,
      valence: 0.75,
      therapeuticProperties: [
        { property: 'creativity', strength: 0.85 },
        { property: 'open-mindedness', strength: 0.8 },
      ],
      audioUrl: '/audio/therapy/creative-flow.mp3',
      isGenerated: false,
    },
  ],
  meditation: [
    {
      id: 'meditation-1',
      title: 'Présence',
      artist: 'EmotionsCare',
      duration: 600,
      genre: 'ambient',
      bpm: 45,
      energy: 0.15,
      valence: 0.6,
      therapeuticProperties: [
        { property: 'mindfulness', strength: 0.9 },
        { property: 'presence', strength: 0.9 },
      ],
      audioUrl: '/audio/therapy/presence.mp3',
      isGenerated: false,
    },
  ],
};

class MusicTherapyServiceEnriched {
  private currentSession: MusicSession | null = null;
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;

  /**
   * Initialize audio context
   */
  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!this.audioElement) {
      this.audioElement = new Audio();
    }
  }

  /**
   * Load user preferences
   */
  async loadPreferences(userId: string): Promise<MusicPreferences> {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', userId)
        .eq('key', 'music_therapy_preferences')
        .maybeSingle();

      if (data?.value) {
        return JSON.parse(data.value);
      }
    } catch (err) {
      logger.error('Failed to load music preferences', err as Error, 'MUSIC_THERAPY');
    }

    // Default preferences
    return {
      favoriteGenres: ['ambient', 'lo-fi', 'nature'],
      dislikedGenres: [],
      preferredBpmRange: { min: 40, max: 100 },
      instrumentPreferences: ['piano', 'strings', 'synth'],
      therapyGoals: ['relaxation', 'focus'],
      sessionDuration: 30,
    };
  }

  /**
   * Save user preferences
   */
  async savePreferences(userId: string, preferences: MusicPreferences): Promise<void> {
    try {
      await supabase.from('user_settings').upsert({
        user_id: userId,
        key: 'music_therapy_preferences',
        value: JSON.stringify(preferences),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,key' });

      logger.info('Music preferences saved', { userId }, 'MUSIC_THERAPY');
    } catch (err) {
      logger.error('Failed to save music preferences', err as Error, 'MUSIC_THERAPY');
    }
  }

  /**
   * Generate therapeutic playlist
   */
  async generatePlaylist(config: PlaylistConfig): Promise<TherapeuticTrack[]> {
    const { moodTarget, duration, startEnergy, endEnergy } = config;

    // Get base tracks for mood target
    const baseTracks = DEFAULT_TRACKS[moodTarget] || DEFAULT_TRACKS.relaxation;
    const playlist: TherapeuticTrack[] = [];
    let totalDuration = 0;
    const targetDuration = duration * 60; // Convert to seconds

    // Try to generate via edge function first
    try {
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate_therapeutic',
          moodTarget,
          duration,
          energy: { start: startEnergy, end: endEnergy },
          genres: config.genres,
        },
      });

      if (!error && data?.tracks) {
        return data.tracks;
      }
    } catch {
      // Fall back to default tracks
    }

    // Calculate energy progression
    const trackCount = Math.ceil(targetDuration / 300); // ~5 min per track
    const energyStep = (endEnergy - startEnergy) / Math.max(1, trackCount - 1);

    // Build playlist with energy progression
    for (let i = 0; i < trackCount && totalDuration < targetDuration; i++) {
      const targetEnergy = startEnergy + (energyStep * i);
      
      // Find best matching track
      const availableTracks = baseTracks.filter(
        t => !playlist.find(p => p.id === t.id)
      );

      if (availableTracks.length === 0) {
        // Reuse tracks if needed
        const reusableTrack = baseTracks[i % baseTracks.length];
        playlist.push({ ...reusableTrack, id: `${reusableTrack.id}-${i}` });
        totalDuration += reusableTrack.duration;
        continue;
      }

      // Sort by energy proximity
      const sorted = availableTracks.sort(
        (a, b) => Math.abs(a.energy - targetEnergy) - Math.abs(b.energy - targetEnergy)
      );

      const selected = sorted[0];
      playlist.push(selected);
      totalDuration += selected.duration;
    }

    logger.info('Playlist generated', {
      moodTarget,
      trackCount: playlist.length,
      totalDuration: Math.round(totalDuration / 60),
    }, 'MUSIC_THERAPY');

    return playlist;
  }

  /**
   * Start a therapy session
   */
  async startSession(
    userId: string,
    moodTarget: MoodTarget,
    moodBefore: number,
    playlist: TherapeuticTrack[]
  ): Promise<MusicSession> {
    this.initAudioContext();

    const session: MusicSession = {
      id: crypto.randomUUID(),
      userId,
      startedAt: new Date().toISOString(),
      endedAt: null,
      moodTarget,
      moodBefore,
      moodAfter: null,
      playlist,
      currentTrackIndex: 0,
      effectiveness: null,
      notes: null,
    };

    this.currentSession = session;

    // Save session start
    try {
      await supabase.from('music_therapy_sessions').insert({
        id: session.id,
        user_id: userId,
        started_at: session.startedAt,
        mood_target: moodTarget,
        mood_before: moodBefore,
        playlist: playlist.map(t => t.id),
      });
    } catch {}

    logger.info('Music therapy session started', {
      sessionId: session.id,
      moodTarget,
      trackCount: playlist.length,
    }, 'MUSIC_THERAPY');

    // Start playing first track
    this.playTrack(0);

    return session;
  }

  /**
   * Play a specific track
   */
  playTrack(index: number): void {
    if (!this.currentSession || !this.audioElement) return;
    if (index < 0 || index >= this.currentSession.playlist.length) return;

    const track = this.currentSession.playlist[index];
    this.currentSession.currentTrackIndex = index;

    this.audioElement.src = track.audioUrl;
    this.audioElement.play().catch(err => {
      logger.error('Failed to play track', err, 'MUSIC_THERAPY');
    });

    // Auto-advance to next track
    this.audioElement.onended = () => {
      if (this.currentSession && index < this.currentSession.playlist.length - 1) {
        this.playTrack(index + 1);
      }
    };

    logger.info('Playing track', { trackId: track.id, title: track.title }, 'MUSIC_THERAPY');
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.audioElement?.pause();
  }

  /**
   * Resume playback
   */
  resume(): void {
    this.audioElement?.play().catch(() => {});
  }

  /**
   * Skip to next track
   */
  nextTrack(): void {
    if (!this.currentSession) return;
    const next = this.currentSession.currentTrackIndex + 1;
    if (next < this.currentSession.playlist.length) {
      this.playTrack(next);
    }
  }

  /**
   * Go to previous track
   */
  previousTrack(): void {
    if (!this.currentSession) return;
    const prev = this.currentSession.currentTrackIndex - 1;
    if (prev >= 0) {
      this.playTrack(prev);
    }
  }

  /**
   * Complete session
   */
  async completeSession(
    moodAfter: number,
    effectiveness: number, // 1-5
    notes?: string
  ): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.endedAt = new Date().toISOString();
    this.currentSession.moodAfter = moodAfter;
    this.currentSession.effectiveness = effectiveness;
    this.currentSession.notes = notes || null;

    // Stop playback
    this.audioElement?.pause();

    // Save to database
    try {
      await supabase.from('music_therapy_sessions').update({
        ended_at: this.currentSession.endedAt,
        mood_after: moodAfter,
        effectiveness,
        notes,
      }).eq('id', this.currentSession.id);
    } catch {}

    logger.info('Music therapy session completed', {
      sessionId: this.currentSession.id,
      moodImprovement: moodAfter - this.currentSession.moodBefore,
      effectiveness,
    }, 'MUSIC_THERAPY');

    this.currentSession = null;
  }

  /**
   * Get analytics for user
   */
  async getAnalytics(userId: string): Promise<MusicAnalytics> {
    try {
      const { data: sessions } = await supabase
        .from('music_therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('ended_at', 'is', null)
        .order('started_at', { ascending: false })
        .limit(100);

      if (!sessions || sessions.length === 0) {
        return {
          totalListeningTime: 0,
          sessionsCount: 0,
          averageEffectiveness: 0,
          moodImprovementRate: 0,
          favoriteGenre: 'ambient',
          bestTimeOfDay: 'evening',
          streakDays: 0,
          topTracks: [],
        };
      }

      // Calculate metrics
      const totalListeningTime = sessions.reduce((sum, s) => {
        if (s.started_at && s.ended_at) {
          return sum + (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000;
        }
        return sum;
      }, 0);

      const effectivenessScores = sessions.filter(s => s.effectiveness).map(s => s.effectiveness);
      const averageEffectiveness = effectivenessScores.length > 0
        ? effectivenessScores.reduce((a, b) => a + b, 0) / effectivenessScores.length
        : 0;

      const moodImprovements = sessions
        .filter(s => s.mood_before !== null && s.mood_after !== null)
        .map(s => s.mood_after - s.mood_before);
      const moodImprovementRate = moodImprovements.length > 0
        ? (moodImprovements.filter(m => m > 0).length / moodImprovements.length) * 100
        : 0;

      // Calculate streak
      let streakDays = 0;
      const today = new Date().toDateString();
      const dates = [...new Set(sessions.map(s => new Date(s.started_at).toDateString()))];
      
      if (dates[0] === today) {
        streakDays = 1;
        for (let i = 1; i < dates.length; i++) {
          const current = new Date(dates[i - 1]);
          const prev = new Date(dates[i]);
          if (current.getTime() - prev.getTime() <= 86400000 * 1.5) {
            streakDays++;
          } else {
            break;
          }
        }
      }

      // Best time of day
      const hourCounts: Record<string, number> = {};
      sessions.forEach(s => {
        const hour = new Date(s.started_at).getHours();
        const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        hourCounts[period] = (hourCounts[period] || 0) + 1;
      });
      const bestTimeOfDay = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'evening';

      return {
        totalListeningTime: Math.round(totalListeningTime),
        sessionsCount: sessions.length,
        averageEffectiveness: Math.round(averageEffectiveness * 10) / 10,
        moodImprovementRate: Math.round(moodImprovementRate),
        favoriteGenre: 'ambient', // Would need track data to calculate properly
        bestTimeOfDay,
        streakDays,
        topTracks: [],
      };
    } catch (err) {
      logger.error('Failed to get music analytics', err as Error, 'MUSIC_THERAPY');
      return {
        totalListeningTime: 0,
        sessionsCount: 0,
        averageEffectiveness: 0,
        moodImprovementRate: 0,
        favoriteGenre: 'ambient',
        bestTimeOfDay: 'evening',
        streakDays: 0,
        topTracks: [],
      };
    }
  }

  /**
   * Get recommended playlist based on current state
   */
  async getRecommendation(
    userId: string,
    currentMood: number,
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  ): Promise<{ moodTarget: MoodTarget; playlist: TherapeuticTrack[] }> {
    const preferences = await this.loadPreferences(userId);

    // Determine mood target based on current state and time
    let moodTarget: MoodTarget = 'relaxation';

    if (timeOfDay === 'morning') {
      moodTarget = currentMood < 50 ? 'motivation' : 'energy';
    } else if (timeOfDay === 'afternoon') {
      moodTarget = currentMood < 50 ? 'anxiety-relief' : 'focus';
    } else if (timeOfDay === 'evening') {
      moodTarget = 'relaxation';
    } else {
      moodTarget = 'sleep';
    }

    // Override with user's therapy goals if available
    if (preferences.therapyGoals.length > 0) {
      const goalMatches = preferences.therapyGoals.filter(g => {
        if (timeOfDay === 'night') return g === 'sleep';
        if (timeOfDay === 'morning') return g === 'energy' || g === 'motivation';
        return true;
      });
      if (goalMatches.length > 0) {
        moodTarget = goalMatches[0];
      }
    }

    const playlist = await this.generatePlaylist({
      moodTarget,
      duration: preferences.sessionDuration,
      startEnergy: currentMood < 50 ? 0.3 : 0.5,
      endEnergy: moodTarget === 'energy' || moodTarget === 'motivation' ? 0.8 : 0.2,
      genres: preferences.favoriteGenres,
    });

    return { moodTarget, playlist };
  }

  /**
   * Get current session
   */
  getCurrentSession(): MusicSession | null {
    return this.currentSession;
  }

  /**
   * Get current track
   */
  getCurrentTrack(): TherapeuticTrack | null {
    if (!this.currentSession) return null;
    return this.currentSession.playlist[this.currentSession.currentTrackIndex];
  }

  /**
   * Get playback state
   */
  getPlaybackState(): {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  } {
    return {
      isPlaying: this.audioElement ? !this.audioElement.paused : false,
      currentTime: this.audioElement?.currentTime || 0,
      duration: this.audioElement?.duration || 0,
    };
  }
}

export const musicTherapyServiceEnriched = new MusicTherapyServiceEnriched();
export default musicTherapyServiceEnriched;
