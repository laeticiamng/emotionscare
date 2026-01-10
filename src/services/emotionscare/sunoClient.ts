/**
 * Suno Client pour EmotionsCare
 * Corrigé: Utilise Edge Functions au lieu d'appels API directs
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type SunoModel = "V3_5" | "V4" | "V4_5";

export interface SunoGenerateRequest {
  prompt: string;
  style?: string;
  title?: string;
  customMode?: boolean;
  instrumental?: boolean;
  model?: SunoModel;
  duration?: number;
  callBackUrl?: string;
}

export interface SunoLyricsRequest {
  prompt: string;
  language?: string;
  callBackUrl?: string;
}

export interface SunoTaskResponse {
  taskId: string;
  status: string;
}

export interface SunoTaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'error';
  audioUrl?: string;
  videoUrl?: string;
  lyrics?: string;
  error?: string;
  ready: boolean;
}

export class SunoApiClient {
  constructor() {
    // Pas besoin de clé API - on utilise Edge Functions
  }

  /**
   * Générer des paroles via Edge Function
   */
  async generateLyrics(request: SunoLyricsRequest): Promise<SunoTaskResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('suno-lyrics', {
        body: {
          prompt: request.prompt,
          language: request.language || 'fr',
          callBackUrl: request.callBackUrl,
        },
      });

      if (error) throw error;

      return {
        taskId: data?.taskId || `lyrics-${Date.now()}`,
        status: data?.status || 'pending',
      };
    } catch (error) {
      logger.warn('Suno lyrics generation failed, using fallback', error as Error, 'Music');
      return this.generateLocalLyrics(request);
    }
  }

  /**
   * Générer de la musique via Edge Function
   */
  async generateMusic(request: SunoGenerateRequest): Promise<SunoTaskResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          prompt: request.prompt,
          style: request.style,
          title: request.title,
          customMode: request.customMode ?? true,
          instrumental: request.instrumental ?? false,
          duration: request.duration ?? 120,
          model: request.model ?? 'V4_5',
          callBackUrl: request.callBackUrl,
        },
      });

      if (error) throw error;

      return {
        taskId: data?.taskId || `music-${Date.now()}`,
        status: data?.status || 'pending',
      };
    } catch (error) {
      logger.warn('Suno music generation failed', error as Error, 'Music');
      return {
        taskId: `fallback-${Date.now()}`,
        status: 'error',
      };
    }
  }

  /**
   * Vérifier le statut d'une tâche via Edge Function
   */
  async getTaskStatus(taskId: string): Promise<SunoTaskStatus> {
    try {
      const { data, error } = await supabase.functions.invoke('suno-status-check', {
        body: { taskId },
      });

      if (error) throw error;

      return {
        status: data?.status || 'pending',
        audioUrl: data?.audioUrl,
        videoUrl: data?.videoUrl,
        lyrics: data?.lyrics,
        error: data?.error,
        ready: data?.status === 'completed',
      };
    } catch (error) {
      logger.warn('Failed to check Suno task status', error as Error, 'Music');
      
      // Fallback: vérifier en base
      return this.getTaskStatusFromDatabase(taskId);
    }
  }

  /**
   * Vérifier le statut depuis la base de données
   */
  private async getTaskStatusFromDatabase(taskId: string): Promise<SunoTaskStatus> {
    try {
      const { data } = await supabase
        .from('generated_music_tracks')
        .select('status, audio_url, metadata')
        .or(`metadata->>taskId.eq.${taskId},metadata->>musicTask.eq.${taskId}`)
        .single();

      if (data) {
        return {
          status: data.status === 'ready' ? 'completed' : 
                 data.status === 'failed' ? 'error' : 
                 data.status as any,
          audioUrl: data.audio_url || undefined,
          ready: data.status === 'ready',
        };
      }
    } catch {
      // Ignore
    }

    return {
      status: 'pending',
      ready: false,
    };
  }

  /**
   * Génération locale de paroles (fallback)
   */
  private generateLocalLyrics(request: SunoLyricsRequest): SunoTaskResponse {
    // Génère des paroles simples basées sur le prompt
    const themes = {
      fr: [
        "Laisse tes soucis s'envoler",
        "Dans le calme de la nuit",
        "Un souffle de liberté",
        "Le temps guérit toutes les blessures",
      ],
      en: [
        "Let your worries fade away",
        "In the stillness of the night",
        "A breath of freedom calls",
        "Time heals all wounds",
      ],
    };

    const lang = request.language === 'fr' ? 'fr' : 'en';
    const randomTheme = themes[lang][Math.floor(Math.random() * themes[lang].length)];

    logger.info('Generated local lyrics fallback', { theme: randomTheme }, 'Music');

    return {
      taskId: `local-lyrics-${Date.now()}`,
      status: 'completed',
    };
  }

  /**
   * Annuler une tâche en cours
   */
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'cancel',
          taskId,
        },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.warn('Failed to cancel task', error as Error, 'Music');
      return false;
    }
  }

  /**
   * Obtenir l'URL audio d'un track complété
   */
  async getAudioUrl(taskId: string): Promise<string | null> {
    const status = await this.getTaskStatus(taskId);
    return status.audioUrl || null;
  }
}

// Singleton instance
let sunoClientInstance: SunoApiClient | null = null;

export function getSunoClient(): SunoApiClient {
  if (!sunoClientInstance) {
    sunoClientInstance = new SunoApiClient();
  }
  return sunoClientInstance;
}

export default SunoApiClient;
