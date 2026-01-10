/**
 * Générateur de piste EmotionsCare à partir de texte
 * Corrigé: Utilise Edge Functions au lieu de process.env
 */

import { supabase } from '@/integrations/supabase/client';
import { getHumeClient } from './humeClient';
import { choosePreset } from './choosePreset';
import { logger } from '@/lib/logger';

export interface GenerateTrackRequest {
  text: string;
  language?: "English" | "Français";
  callBackUrl?: string;
  userId?: string;
}

export interface GenerateTrackResponse {
  lyricsTask: string;
  musicTask: string;
  preset: any;
  emotions: any[];
  metadata: {
    originalText: string;
    language: string;
    timestamp: string;
    userId?: string;
  };
}

export async function generateTrackFromText({
  text,
  language = "English",
  callBackUrl,
  userId,
}: GenerateTrackRequest): Promise<GenerateTrackResponse> {
  try {
    logger.info('Starting track generation from text', { textLength: text.length }, 'Music');

    // 1. Analyser les émotions avec Hume AI via Edge Function
    const humeClient = getHumeClient();
    const emotions = await humeClient.detectEmotion(text);
    
    // 2. Choisir le preset approprié
    const preset = choosePreset(emotions);
    
    // 3. Assembler le prompt optimisé
    const themeText = text.slice(0, 80).replace(/[^\w\s]/gi, '');
    const prompt = `${language} | ${preset.style} | mood ${preset.tag} | theme: ${themeText}`;
    
    // 4. Générer les paroles via Edge Function
    const { data: lyricsData, error: lyricsError } = await supabase.functions.invoke('suno-lyrics', {
      body: {
        prompt: `${preset.prompt} | Theme: ${themeText} | Language: ${language}`,
        callBackUrl,
      },
    });

    if (lyricsError) {
      logger.warn('Lyrics generation failed', lyricsError, 'Music');
    }

    // 5. Générer la musique via Edge Function
    const { data: musicData, error: musicError } = await supabase.functions.invoke('suno-music', {
      body: {
        prompt,
        style: preset.style,
        title: text.slice(0, 50),
        customMode: false,
        instrumental: false,
        model: "V4_5",
        callBackUrl,
      },
    });

    if (musicError) {
      logger.warn('Music generation failed', musicError, 'Music');
    }

    const response: GenerateTrackResponse = {
      lyricsTask: lyricsData?.taskId || `local-lyrics-${Date.now()}`,
      musicTask: musicData?.taskId || `local-music-${Date.now()}`,
      preset,
      emotions: emotions.slice(0, 5),
      metadata: {
        originalText: text,
        language,
        timestamp: new Date().toISOString(),
        userId,
      },
    };

    // Sauvegarder en base si userId fourni
    if (userId) {
      await saveTrackToDatabase(userId, response, prompt);
    }

    logger.info('Track generation initiated', { musicTask: response.musicTask }, 'Music');
    
    return response;
  } catch (error) {
    logger.error('Track generation failed', error as Error, 'Music');
    throw new Error(`Track generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Sauvegarder le track dans la base de données
 */
async function saveTrackToDatabase(
  userId: string,
  response: GenerateTrackResponse,
  prompt: string
): Promise<void> {
  try {
    await supabase.from('generated_music_tracks').insert({
      owner_id: userId,
      title: response.metadata.originalText.slice(0, 50),
      prompt,
      style: response.preset.style,
      status: 'pending',
      mode: 'A',
      metadata: {
        emotions: response.emotions,
        language: response.metadata.language,
        preset: response.preset.tag,
        lyricsTask: response.lyricsTask,
        musicTask: response.musicTask,
      },
    });
  } catch (error) {
    logger.warn('Failed to save track to database', error as Error, 'Music');
  }
}

/**
 * Obtenir le statut des tâches via Edge Function
 */
export async function getTasksStatus(lyricsTaskId: string, musicTaskId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('suno-status-check', {
      body: {
        lyricsTaskId,
        musicTaskId,
      },
    });

    if (error) throw error;

    return {
      lyrics: data?.lyrics || { status: 'unknown' },
      music: data?.music || { status: 'unknown' },
      isComplete: data?.isComplete || false,
      isProcessing: data?.isProcessing || false,
      hasError: data?.hasError || false,
    };
  } catch (error) {
    logger.warn('Failed to get tasks status', error as Error, 'Music');
    
    // Fallback: vérifier en base
    return await getTasksStatusFromDatabase(musicTaskId);
  }
}

/**
 * Vérifier le statut depuis la base de données
 */
async function getTasksStatusFromDatabase(musicTaskId: string) {
  try {
    const { data } = await supabase
      .from('generated_music_tracks')
      .select('status, audio_url')
      .or(`metadata->musicTask.eq.${musicTaskId}`)
      .single();

    if (data) {
      return {
        lyrics: { status: data.status },
        music: { status: data.status, audio_url: data.audio_url },
        isComplete: data.status === 'ready',
        isProcessing: data.status === 'processing' || data.status === 'pending',
        hasError: data.status === 'failed',
      };
    }
  } catch {
    // Ignore
  }

  return {
    lyrics: { status: 'unknown' },
    music: { status: 'unknown' },
    isComplete: false,
    isProcessing: false,
    hasError: false,
  };
}

/**
 * Récupérer les tracks d'un utilisateur
 */
export async function getUserTracks(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('generated_music_tracks')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Failed to get user tracks', error as Error, 'Music');
    return [];
  }
}
