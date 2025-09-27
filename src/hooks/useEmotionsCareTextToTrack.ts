
// Hook React pour la génération de tracks EmotionsCare à partir de texte
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      console.log('🎵 EmotionsCare: Starting track generation from text:', text.slice(0, 50) + '...');
      
      const { data, error } = await supabase.functions.invoke('emotionscare-text-to-track', {
        body: {
          text,
          language,
          callBackUrl,
        },
      });

      if (error) {
        console.error('❌ EmotionsCare: Generation error:', error);
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

      console.log('✅ EmotionsCare: Track generation initiated:', track);
      return track;

    } catch (error) {
      console.error('❌ EmotionsCare: Generation failed:', error);
      
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
      console.log('🔍 EmotionsCare: Checking tasks status...', { lyricsTaskId, musicTaskId });
      
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
      console.error('❌ EmotionsCare: Failed to check tasks status:', error);
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
