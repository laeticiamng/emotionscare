
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/types/music';

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMusic = async (emotion: string, prompt?: string): Promise<MusicTrack | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('music-generation', {
        body: { 
          emotion,
          prompt: prompt || `Musique ${emotion} relaxante`,
          duration: 120 // 2 minutes par défaut
        }
      });

      if (error) {
        console.error('Erreur génération musique:', error);
        setError('Erreur lors de la génération musicale');
        return null;
      }

      if (data?.audioUrl) {
        const track: MusicTrack = {
          id: `generated-${Date.now()}`,
          title: data.title || `Musique ${emotion}`,
          artist: 'Suno AI',
          url: data.audioUrl,
          audioUrl: data.audioUrl,
          duration: data.duration || 120,
          emotion,
          coverUrl: data.coverUrl
        };

        return track;
      }

      return null;
    } catch (err) {
      console.error('Erreur génération:', err);
      setError('Erreur lors de la génération musicale');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMusic,
    isGenerating,
    error
  };
};
