/**
 * Suno AI Music Integration - Génération musicale IA avancée
 * Intègre l'API Suno pour la création de musique thérapeutique personnalisée
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface SunoGenerationRequest {
  prompt: string;
  style?: string;
  duration?: number;
  mood?: string;
  therapeuticGoal?: 'relaxation' | 'energize' | 'focus' | 'sleep' | 'emotional_release';
  tempo?: 'slow' | 'medium' | 'fast';
  instrumental?: boolean;
}

export interface SunoGenerationResult {
  id: string;
  audioUrl: string;
  title: string;
  style: string;
  duration: number;
  metadata: {
    prompt: string;
    createdAt: string;
    therapeuticProperties: {
      moodTarget: string;
      energyLevel: number;
      stressReduction: number;
    };
  };
}

export interface SunoTrack {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  style: string;
  therapeuticScore: number;
  createdAt: string;
}

export interface TherapeuticPlaylistRequest {
  emotionalState: string;
  targetMood: string;
  duration: number;
  preferences?: {
    genres?: string[];
    tempo?: string;
    instrumental?: boolean;
  };
}

// ============================================================================
// SUNO INTEGRATION SERVICE
// ============================================================================

export class SunoMusicService {
  /**
   * Générer un morceau musical personnalisé avec Suno AI
   */
  static async generateTrack(request: SunoGenerationRequest): Promise<SunoGenerationResult> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Construire le prompt thérapeutique
    const therapeuticPrompt = this.buildTherapeuticPrompt(request);

    // Appeler l'edge function Suno
    const { data, error } = await supabase.functions.invoke('suno-music', {
      body: {
        action: 'generate',
        prompt: therapeuticPrompt,
        style: request.style || 'ambient',
        duration: request.duration || 180,
        instrumental: request.instrumental ?? true
      }
    });

    if (error) {
      console.error('Suno generation error:', error);
      // Fallback vers une piste prédéfinie si l'API échoue
      return this.getFallbackTrack(request);
    }

    // Sauvegarder la piste générée
    await this.saveGeneratedTrack(user.id, data);

    return {
      id: data.id,
      audioUrl: data.audio_url,
      title: data.title || 'Piste thérapeutique',
      style: request.style || 'ambient',
      duration: data.duration || request.duration || 180,
      metadata: {
        prompt: therapeuticPrompt,
        createdAt: new Date().toISOString(),
        therapeuticProperties: {
          moodTarget: request.mood || 'calm',
          energyLevel: this.calculateEnergyLevel(request),
          stressReduction: this.calculateStressReduction(request)
        }
      }
    };
  }

  /**
   * Générer une playlist thérapeutique complète
   */
  static async generateTherapeuticPlaylist(
    request: TherapeuticPlaylistRequest
  ): Promise<SunoTrack[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const trackCount = Math.ceil(request.duration / 180); // 3 min par piste
    const tracks: SunoTrack[] = [];

    // Générer les pistes progressivement
    for (let i = 0; i < trackCount; i++) {
      const progressRatio = i / (trackCount - 1 || 1);
      const currentMood = this.interpolateMood(
        request.emotionalState,
        request.targetMood,
        progressRatio
      );

      try {
        const track = await this.generateTrack({
          prompt: `${currentMood} therapeutic music for emotional wellness`,
          mood: currentMood,
          style: request.preferences?.genres?.[0] || 'ambient',
          tempo: request.preferences?.tempo as any || 'medium',
          instrumental: request.preferences?.instrumental ?? true,
          duration: 180
        });

        tracks.push({
          id: track.id,
          title: track.title,
          audioUrl: track.audioUrl,
          duration: track.duration,
          style: track.style,
          therapeuticScore: track.metadata.therapeuticProperties.stressReduction,
          createdAt: track.metadata.createdAt
        });
      } catch (error) {
        console.error(`Track ${i + 1} generation failed, using fallback`);
        const fallback = await this.getFallbackTrack({ mood: currentMood });
        tracks.push({
          id: fallback.id,
          title: fallback.title,
          audioUrl: fallback.audioUrl,
          duration: fallback.duration,
          style: fallback.style,
          therapeuticScore: 0.7,
          createdAt: new Date().toISOString()
        });
      }
    }

    return tracks;
  }

  /**
   * Récupérer les pistes générées par l'utilisateur
   */
  static async getUserGeneratedTracks(userId: string): Promise<SunoTrack[]> {
    const { data, error } = await supabase
      .from('suno_generated_tracks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching user tracks:', error);
      return [];
    }

    return (data || []).map(track => ({
      id: track.id,
      title: track.title,
      audioUrl: track.audio_url,
      duration: track.duration,
      style: track.style,
      therapeuticScore: track.therapeutic_score || 0.5,
      createdAt: track.created_at
    }));
  }

  /**
   * Adapter une piste en temps réel selon l'état émotionnel
   */
  static async adaptTrackToMood(
    trackId: string,
    currentMood: number,
    targetMood: number
  ): Promise<{ adjustedUrl: string; adaptations: string[] }> {
    const { data, error } = await supabase.functions.invoke('adaptive-music', {
      body: {
        action: 'adapt',
        trackId,
        currentMood,
        targetMood
      }
    });

    if (error) {
      return { adjustedUrl: '', adaptations: [] };
    }

    return {
      adjustedUrl: data.adjusted_url || '',
      adaptations: data.adaptations || []
    };
  }

  // --------------------------------------------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------------------------------------------

  /**
   * Construire un prompt optimisé pour la thérapie musicale
   */
  private static buildTherapeuticPrompt(request: SunoGenerationRequest): string {
    const elements: string[] = [];

    // Base thérapeutique
    if (request.therapeuticGoal) {
      const goalPrompts: Record<string, string> = {
        relaxation: 'deeply calming and soothing',
        energize: 'uplifting and invigorating',
        focus: 'concentration-enhancing with steady rhythm',
        sleep: 'gentle lullaby-like with slow fade',
        emotional_release: 'cathartic and emotionally expressive'
      };
      elements.push(goalPrompts[request.therapeuticGoal]);
    }

    // Mood
    if (request.mood) {
      elements.push(`evoking ${request.mood} feelings`);
    }

    // Style
    if (request.style) {
      elements.push(`in ${request.style} style`);
    }

    // Tempo
    if (request.tempo) {
      const tempoMap: Record<string, string> = {
        slow: 'at 60-80 BPM',
        medium: 'at 90-110 BPM',
        fast: 'at 120-140 BPM'
      };
      elements.push(tempoMap[request.tempo]);
    }

    // Instrumental
    if (request.instrumental) {
      elements.push('purely instrumental, no vocals');
    }

    // Prompt personnalisé
    if (request.prompt) {
      elements.push(request.prompt);
    }

    return elements.join(', ') + ' for therapeutic wellness purposes';
  }

  /**
   * Interpoler l'humeur entre deux états
   */
  private static interpolateMood(from: string, to: string, ratio: number): string {
    const moodScale: Record<string, number> = {
      stressed: 0, anxious: 1, sad: 2, neutral: 5, calm: 7, peaceful: 8, joyful: 10
    };

    const fromValue = moodScale[from] ?? 5;
    const toValue = moodScale[to] ?? 7;
    const interpolated = fromValue + (toValue - fromValue) * ratio;

    if (interpolated <= 2) return 'transitioning';
    if (interpolated <= 5) return 'calming';
    if (interpolated <= 7) return 'peaceful';
    return 'uplifting';
  }

  /**
   * Calculer le niveau d'énergie basé sur la requête
   */
  private static calculateEnergyLevel(request: SunoGenerationRequest): number {
    const baseEnergy: Record<string, number> = {
      relaxation: 0.3,
      energize: 0.8,
      focus: 0.5,
      sleep: 0.1,
      emotional_release: 0.6
    };

    const tempoModifier: Record<string, number> = {
      slow: -0.1,
      medium: 0,
      fast: 0.2
    };

    const base = baseEnergy[request.therapeuticGoal || 'relaxation'] || 0.5;
    const modifier = tempoModifier[request.tempo || 'medium'] || 0;

    return Math.max(0, Math.min(1, base + modifier));
  }

  /**
   * Calculer le potentiel de réduction du stress
   */
  private static calculateStressReduction(request: SunoGenerationRequest): number {
    const goalScores: Record<string, number> = {
      relaxation: 0.9,
      energize: 0.5,
      focus: 0.6,
      sleep: 0.95,
      emotional_release: 0.7
    };

    return goalScores[request.therapeuticGoal || 'relaxation'] || 0.6;
  }

  /**
   * Obtenir une piste de fallback fiable
   */
  private static async getFallbackTrack(request: Partial<SunoGenerationRequest>): Promise<SunoGenerationResult> {
    // Pistes de fallback depuis des sources fiables (CORS-friendly)
    const fallbackTracks = [
      {
        id: 'fallback-calm-1',
        audioUrl: 'https://storage.googleapis.com/media-session/sintel/snow-fight.mp3',
        title: 'Méditation Paisible',
        style: 'ambient'
      },
      {
        id: 'fallback-focus-1',
        audioUrl: 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
        title: 'Focus Profond',
        style: 'minimal'
      },
      {
        id: 'fallback-energy-1',
        audioUrl: 'https://storage.googleapis.com/media-session/big-buck-bunny/prelude.mp3',
        title: 'Énergie Positive',
        style: 'uplifting'
      }
    ];

    const track = fallbackTracks[Math.floor(Math.random() * fallbackTracks.length)];

    return {
      id: track.id,
      audioUrl: track.audioUrl,
      title: track.title,
      style: track.style,
      duration: 180,
      metadata: {
        prompt: 'fallback track',
        createdAt: new Date().toISOString(),
        therapeuticProperties: {
          moodTarget: request.mood || 'calm',
          energyLevel: 0.5,
          stressReduction: 0.7
        }
      }
    };
  }

  /**
   * Sauvegarder une piste générée
   */
  private static async saveGeneratedTrack(userId: string, trackData: any): Promise<void> {
    try {
      await supabase.from('suno_generated_tracks').insert({
        user_id: userId,
        suno_id: trackData.id,
        title: trackData.title,
        audio_url: trackData.audio_url,
        duration: trackData.duration,
        style: trackData.style,
        prompt: trackData.prompt,
        therapeutic_score: 0.8
      });
    } catch (error) {
      console.error('Error saving generated track:', error);
    }
  }
}

export const sunoMusicService = SunoMusicService;
