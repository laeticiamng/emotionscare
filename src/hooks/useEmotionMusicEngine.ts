
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { MusicTrack } from '@/types/music';

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

  const generateMusicForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicTrack | null> => {
    setIsGenerating(true);
    
    try {
      console.log('Génération musicale pour émotion:', params);
      
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          emotion: params.emotion,
          intensity: params.intensity,
          style: params.style || 'ambient',
          lyrics: params.lyrics || '',
          duration: params.duration || 240
        }
      });

      if (error) {
        console.error('Erreur génération musicale:', error);
        throw error;
      }

      if (data?.music) {
        const track: MusicTrack = {
          id: data.music.id,
          title: data.music.title,
          artist: 'EmotionsCare AI',
          audioUrl: data.music.audioUrl,
          url: data.music.audioUrl,
          duration: data.music.duration,
          emotion: params.emotion,
          intensity: params.intensity
        };
        
        setCurrentTrack(track);
        console.log('Musique générée avec succès:', track);
        return track;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la génération musicale:', error);
      throw error;
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
    currentTrack
  };
};
