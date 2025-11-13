// @ts-nocheck

import { useState } from 'react';
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
}

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMusic = async (
    emotion: string, 
    customPrompt?: string,
    mood?: string,
    intensity: number = 0.5,
    userContext?: string
  ): Promise<GeneratedTrack | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      logger.info('🎵 Génération musique 100% personnalisée style Nekfeu/Kendrick', { emotion, mood, intensity }, 'MUSIC');
      
      // Étape 1: Générer le prompt Suno optimal via IA
      const { data: promptData, error: promptError } = await supabase.functions.invoke('generate-suno-prompt', {
        body: {
          emotion,
          intensity: intensity * 100,
          userContext,
          mood
        }
      });

      if (promptError || !promptData?.success) {
        throw new Error('Erreur génération prompt IA');
      }

      const aiPrompt = promptData.prompt;
      logger.info('✅ Prompt IA généré:', aiPrompt, 'MUSIC');

      // Étape 2: Envoyer à Suno avec le prompt optimisé
      const { data, error: functionError } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          emotion: emotion,
          mood: mood,
          intensity: intensity,
          style: aiPrompt.style,
          lyrics: aiPrompt.prompt_lyrics,
          customMode: true,
          instrumental: false, // AVEC lyrics style rap
          bpm: aiPrompt.bpm,
          tags: aiPrompt.mood_tags
        }
      });

      if (functionError) {
        logger.error('❌ Erreur Suno', functionError, 'MUSIC');
        throw new Error(functionError.message || 'Erreur lors de la génération');
      }

      if (!data) {
        throw new Error('Aucune donnée reçue de la génération musicale');
      }

      logger.info('✅ Track Suno générée avec succès', data, 'MUSIC');
      return data as GeneratedTrack;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la génération musicale';
      logger.error('❌ Erreur génération musique', { errorMessage }, 'MUSIC');
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
