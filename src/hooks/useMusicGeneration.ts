import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
  taskId?: string;
  status?: 'pending' | 'generating' | 'completed' | 'failed';
}

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const generateMusic = useCallback(async (
    emotion: string, 
    customPrompt?: string,
    mood?: string,
    intensity: number = 0.5,
    userContext?: string,
    bpmPreferences?: { min?: number; max?: number; tempo?: string }
  ): Promise<GeneratedTrack | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      logger.info('🎵 Génération musique thérapeutique', { emotion, mood, intensity, bpmPreferences }, 'MUSIC');
      
      // Utiliser emotion-music-ai qui gère tout le flow Suno
      const { data, error: functionError } = await supabase.functions.invoke('emotion-music-ai', {
        body: {
          action: 'generate-music',
          emotion: emotion,
          customPrompt: customPrompt || undefined,
          mood: mood,
          intensity: intensity,
          userContext: userContext,
          bpmMin: bpmPreferences?.min,
          bpmMax: bpmPreferences?.max,
          tempo: bpmPreferences?.tempo
        }
      });

      if (functionError) {
        logger.error('❌ Erreur génération', functionError, 'MUSIC');
        throw new Error(functionError.message || 'Erreur lors de la génération');
      }

      if (!data?.success) {
        throw new Error(data?.error || data?.message || 'Échec de la génération');
      }

      const taskId = data.taskId;
      setCurrentTaskId(taskId);
      logger.info('✅ Génération démarrée', { taskId }, 'MUSIC');

      // Si la piste est déjà prête (fallback)
      if (data.audio_url) {
        return {
          id: data.trackId || taskId,
          title: data.title || `${emotion} - Therapeutic Music`,
          artist: 'AI Generated',
          url: data.audio_url,
          audioUrl: data.audio_url,
          duration: data.duration || 60,
          emotion: emotion,
          mood: mood,
          status: 'completed'
        };
      }

      // Polling pour attendre la génération avec meilleure gestion
      const track = await pollForCompletion(taskId, data.trackId, emotion, mood);
      return track;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la génération musicale';
      logger.error('❌ Erreur génération musique', { errorMessage }, 'MUSIC');
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
      setCurrentTaskId(null);
    }
  }, []);

  const pollForCompletion = async (
    taskId: string, 
    trackId: string | undefined,
    emotion: string,
    mood?: string
  ): Promise<GeneratedTrack | null> => {
    const maxAttempts = 90; // 3 minutes max (2s intervals)
    let attempts = 0;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;

      try {
        const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
          body: {
            action: 'check-status',
            sunoTaskId: taskId,
            trackId: trackId
          }
        });

        if (error) {
          consecutiveErrors++;
          logger.warn('Status check error', { error, consecutiveErrors }, 'MUSIC');
          if (consecutiveErrors >= maxConsecutiveErrors) {
            throw new Error('Trop d\'erreurs consécutives lors du polling');
          }
          continue;
        }

        // Reset consecutive errors on success
        consecutiveErrors = 0;

        // Handle all completion statuses
        const status = data?.status?.toLowerCase();
        if (status === 'complete' || status === 'completed' || status === 'success') {
          return {
            id: trackId || taskId,
            title: data.title || `${emotion} - Therapeutic Music`,
            artist: 'AI Generated',
            url: data.audio_url,
            audioUrl: data.audio_url,
            duration: data.duration || 60,
            emotion: emotion,
            mood: mood,
            coverUrl: data.image_url,
            status: 'completed'
          };
        }

        // Handle failure statuses
        if (status === 'failed' || status === 'error' || status === 'cancelled') {
          throw new Error(data?.error || 'La génération a échoué');
        }

        // Log progress for pending statuses
        const progressStatuses = ['pending', 'processing', 'generating', 'queued', 'running'];
        if (progressStatuses.includes(status)) {
          logger.info(`Génération en cours... (${attempts}/${maxAttempts})`, { status }, 'MUSIC');
        }
      } catch (err) {
        consecutiveErrors++;
        logger.warn('Polling error', { err, consecutiveErrors }, 'MUSIC');
        if (consecutiveErrors >= maxConsecutiveErrors) {
          throw err;
        }
      }
    }

    throw new Error('Timeout: la génération a pris trop de temps (3 min)');
  };

  const checkStatus = useCallback(async (taskId: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: {
          action: 'check-status',
          sunoTaskId: taskId
        }
      });

      if (error) throw error;
      return data?.status || 'unknown';
    } catch {
      return 'error';
    }
  }, []);

  return {
    generateMusic,
    isGenerating,
    error,
    currentTaskId,
    checkStatus
  };
};
