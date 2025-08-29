
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMusic = async (
    emotion: string, 
    customPrompt?: string,
    mood?: string,
    intensity: number = 0.5
  ): Promise<GeneratedTrack | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎵 Génération de musique EmotionsCare:', { emotion, customPrompt, mood, intensity });
      
      const { data, error: functionError } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          emotion: emotion,
          mood: mood,
          intensity: intensity,
          style: customPrompt || undefined,
          lyrics: undefined // Instrumental par défaut pour EmotionsCare
        }
      });

      if (functionError) {
        console.error('❌ Erreur de la fonction:', functionError);
        throw new Error(functionError.message || 'Erreur lors de la génération');
      }

      if (!data) {
        throw new Error('Aucune donnée reçue de la génération musicale');
      }

      console.log('✅ Musique générée avec succès:', data);
      return data as GeneratedTrack;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la génération musicale';
      console.error('❌ Erreur génération musique:', errorMessage);
      setError(errorMessage);
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
