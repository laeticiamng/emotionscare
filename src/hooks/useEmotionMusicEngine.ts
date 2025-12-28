import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface EmotionMusicParams {
  emotion: string;
  intensity: number;
  duration?: number;
  style?: string;
  lyrics?: string;
}

export const useEmotionMusicEngine = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateMusicForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicTrack | null> => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      logger.info('Génération musicale Suno pour émotion', params, 'MUSIC');
      
      // Utiliser l'edge function suno-music qui existe
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate',
          emotion: params.emotion,
          intensity: params.intensity,
          style: params.style || 'therapeutic ambient',
          prompt: `Musique thérapeutique ${params.style || 'ambient'} pour émotion ${params.emotion}`,
          instrumental: true,
          duration: params.duration || 240,
          model: 'V4_5'
        }
      });

      if (error) {
        logger.error('Erreur génération Suno', error as Error, 'MUSIC');
        toast.error('Erreur lors de la génération de musique');
        return null;
      }

      setGenerationProgress(30);

      // Si on a un taskId, on doit poller pour le statut
      if (data?.data?.taskId) {
        const taskId = data.data.taskId;
        let attempts = 0;
        const maxAttempts = 30;

        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts++;
          setGenerationProgress(30 + (attempts / maxAttempts) * 60);

          const { data: statusData, error: statusError } = await supabase.functions.invoke('suno-music', {
            body: { action: 'status', taskId }
          });

          if (statusError) continue;

          if (statusData?.data?.status === 'completed' || statusData?.data?.status === 'complete') {
            const audioUrl = statusData.data.audio_url || statusData.data.audioUrl;
            if (audioUrl) {
              const track: MusicTrack = {
                id: taskId,
                title: statusData.data.title || `Musique ${params.emotion}`,
                artist: 'Suno AI',
                audioUrl,
                url: audioUrl,
                duration: statusData.data.duration || params.duration || 240,
                emotion: params.emotion,
                coverUrl: statusData.data.image_url || statusData.data.imageUrl,
                isGenerated: true,
                generatedAt: new Date().toISOString()
              };
              
              setCurrentTrack(track);
              setGenerationProgress(100);
              toast.success('Musique générée avec succès !');
              return track;
            }
          }
        }

        toast.error('Timeout - Génération trop longue');
        return null;
      }

      // Réponse directe avec audio
      if (data?.data?.audio_url || data?.data?.audioUrl) {
        const track: MusicTrack = {
          id: data.data.id || `generated-${Date.now()}`,
          title: data.data.title || `Musique ${params.emotion}`,
          artist: 'Suno AI',
          audioUrl: data.data.audio_url || data.data.audioUrl,
          url: data.data.audio_url || data.data.audioUrl,
          duration: data.data.duration || params.duration || 240,
          emotion: params.emotion,
          coverUrl: data.data.image_url || data.data.imageUrl,
          isGenerated: true,
          generatedAt: new Date().toISOString()
        };
        
        setCurrentTrack(track);
        setGenerationProgress(100);
        toast.success('Musique générée avec succès !');
        return track;
      }

      return null;
    } catch (error) {
      logger.error('Erreur lors de la génération musicale', error as Error, 'MUSIC');
      toast.error('Erreur lors de la génération');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const analyzeEmotionAndGenerateMusic = useCallback(async (emotionResult: EmotionResult): Promise<MusicTrack | null> => {
    if (!emotionResult.emotion) {
      throw new Error('Émotion manquante pour la génération musicale');
    }

    // Mapping sophistiqué des émotions vers les styles musicaux
    const emotionToStyleMap: Record<string, string> = {
      'calm': 'ambient',
      'relaxed': 'lofi-piano', 
      'happy': 'upbeat',
      'joyful': 'upbeat',
      'excited': 'energetic',
      'sad': 'melancholic',
      'melancholic': 'acoustic',
      'anxious': 'calming',
      'stressed': 'meditation',
      'angry': 'cathartic',
      'focused': 'concentration',
      'creative': 'instrumental',
      'nostalgic': 'ambient-emotional'
    };

    const style = emotionToStyleMap[emotionResult.emotion.toLowerCase()] || 'ambient';
    const intensity = emotionResult.confidence || 0.5;

    return await generateMusicForEmotion({
      emotion: emotionResult.emotion,
      intensity,
      style,
      duration: 240
    });
  }, [generateMusicForEmotion]);

  return {
    generateMusicForEmotion,
    analyzeEmotionAndGenerateMusic,
    isGenerating,
    currentTrack,
    generationProgress
  };
};
