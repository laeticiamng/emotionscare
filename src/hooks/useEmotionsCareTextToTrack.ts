// @ts-nocheck -- TODO: typer les réponses Edge Function text-to-track

// Hook React pour la génération de tracks EmotionsCare à partir de texte
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface GenerateTrackRequest {
  text: string;
  language?: "English" | "Français";
  callBackUrl?: string;
}

export interface GeneratedTrack {
  id: string;
  title: string;
  lyricsTaskId: string;
  musicTaskId: string;
  preset: any;
  emotions: any[];
  metadata: any;
}

export function useEmotionsCareTextToTrack() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const { toast } = useToast();

  const generateTrack = async ({ text, language = "English", callBackUrl }: GenerateTrackRequest) => {
    if (!text.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un texte pour générer la musique",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      logger.info('🎵 EmotionsCare: Starting track generation from text', { text: text.slice(0, 50) + '...' }, 'MUSIC');
      
      const { data, error } = await supabase.functions.invoke('emotionscare-text-to-track', {
        body: {
          text,
          language,
          callBackUrl,
        },
      });

      if (error) {
        logger.error('❌ EmotionsCare: Generation error', error as Error, 'MUSIC');
        throw new Error(error.message || 'Erreur lors de la génération');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      const track: GeneratedTrack = {
        id: data.track.id,
        title: data.track.title,
        lyricsTaskId: data.lyricsTaskId,
        musicTaskId: data.musicTaskId,
        preset: data.preset,
        emotions: data.emotions,
        metadata: data.metadata,
      };

      setGeneratedTrack(track);

      toast({
        title: "🎵 Génération EmotionsCare lancée !",
        description: `Génération de "${track.title}" en cours... Preset: ${track.preset.tag}`,
      });

      logger.info('✅ EmotionsCare: Track generation initiated', track, 'MUSIC');
      return track;

    } catch (error) {
      logger.error('❌ EmotionsCare: Generation failed', error as Error, 'MUSIC');
      
      toast({
        title: "Erreur de génération",
        description: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const checkTasksStatus = async (lyricsTaskId: string, musicTaskId: string) => {
    try {
      // Cette fonction devrait idéalement appeler une edge function
      // qui vérifie le statut des tâches Suno
      logger.info('🔍 EmotionsCare: Checking tasks status', { lyricsTaskId, musicTaskId }, 'MUSIC');
      
      // Pour l'instant, on retourne un statut simulé
      // En production, cela devrait faire appel à l'API Suno
      return {
        lyrics: { status: 'processing' },
        music: { status: 'processing' },
        isComplete: false,
        isProcessing: true,
        hasError: false,
      };
    } catch (error) {
      logger.error('❌ EmotionsCare: Failed to check tasks status', error as Error, 'MUSIC');
      throw error;
    }
  };

  const reset = () => {
    setGeneratedTrack(null);
    setIsGenerating(false);
  };

  return {
    generateTrack,
    checkTasksStatus,
    reset,
    isGenerating,
    generatedTrack,
  };
}
