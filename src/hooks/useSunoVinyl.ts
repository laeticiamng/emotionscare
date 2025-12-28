/**
 * useSunoVinyl - Hook pour générer la musique des vinyls via Suno API
 * Gère la génération, le polling du statut, et les fallbacks
 */

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

// Mapping des catégories vinyl vers les prompts Suno
const VINYL_PROMPTS: Record<string, { prompt: string; style: string; mood: string }> = {
  'doux': {
    prompt: 'Gentle flowing ambient music with soft pads, subtle nature sounds, perfect for deep relaxation and stress relief',
    style: 'ambient, therapeutic, soft, calming, atmospheric',
    mood: 'calm'
  },
  'énergique': {
    prompt: 'Uplifting positive energy music with gentle beats, inspiring melodies, motivational and empowering instrumental',
    style: 'upbeat, positive, energetic, motivational, electronic',
    mood: 'energize'
  },
  'créatif': {
    prompt: 'Focus-enhancing instrumental music with lofi elements, subtle rhythms, perfect for concentration and creative work',
    style: 'lofi, focus, concentration, minimal, instrumental',
    mood: 'focus'
  },
  'guérison': {
    prompt: 'Healing therapeutic music with binaural elements, nature sounds, resonant frequencies for emotional restoration',
    style: 'healing, therapeutic, meditative, restorative, ambient',
    mood: 'meditation'
  }
};

// Fallback URLs (Pixabay) si Suno échoue
const FALLBACK_URLS: Record<string, string> = {
  'doux': 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
  'énergique': 'https://cdn.pixabay.com/audio/2022/10/25/audio_946b0939c5.mp3',
  'créatif': 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
  'guérison': 'https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3'
};

interface GenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  isFallback: boolean;
}

interface UseSunoVinylReturn {
  generateForVinyl: (vinylId: string, category: string, title: string) => Promise<string | null>;
  generationState: Record<string, GenerationState>;
  cancelGeneration: (vinylId: string) => void;
}

export function useSunoVinyl(): UseSunoVinylReturn {
  const { toast } = useToast();
  const [generationState, setGenerationState] = useState<Record<string, GenerationState>>({});
  const abortControllers = useRef<Record<string, AbortController>>({});

  const updateState = useCallback((vinylId: string, updates: Partial<GenerationState>) => {
    setGenerationState(prev => ({
      ...prev,
      [vinylId]: {
        isGenerating: prev[vinylId]?.isGenerating ?? false,
        progress: prev[vinylId]?.progress ?? 0,
        error: prev[vinylId]?.error ?? null,
        isFallback: prev[vinylId]?.isFallback ?? false,
        ...updates
      }
    }));
  }, []);

  const pollForCompletion = useCallback(async (
    taskId: string,
    vinylId: string,
    maxAttempts = 30
  ): Promise<string | null> => {
    const controller = abortControllers.current[vinylId];
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (controller?.signal.aborted) {
        logger.info(`Generation cancelled for ${vinylId}`, {}, 'MUSIC');
        return null;
      }

      try {
        const { data, error } = await supabase.functions.invoke('suno-music', {
          body: {
            action: 'status',
            trackIds: [taskId]
          }
        });

        if (error) throw error;

        const statusData = data?.data || data;
        const status = statusData?.status;
        const audioUrl = statusData?.audio_url || statusData?.audioUrl;

        // Update progress
        const progress = Math.min(10 + (attempt / maxAttempts) * 85, 95);
        updateState(vinylId, { progress });

        if (status === 'completed' && audioUrl) {
          logger.info(`Suno generation completed for ${vinylId}`, { audioUrl }, 'MUSIC');
          return audioUrl;
        }

        if (status === 'failed' || status === 'error') {
          throw new Error('Generation failed');
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (pollError) {
        logger.warn(`Poll attempt ${attempt} failed for ${vinylId}`, pollError as Error, 'MUSIC');
        if (attempt === maxAttempts - 1) throw pollError;
      }
    }

    throw new Error('Generation timeout');
  }, [updateState]);

  const generateForVinyl = useCallback(async (
    vinylId: string,
    category: string,
    title: string
  ): Promise<string | null> => {
    // Cancel any existing generation for this vinyl
    if (abortControllers.current[vinylId]) {
      abortControllers.current[vinylId].abort();
    }
    abortControllers.current[vinylId] = new AbortController();

    const config = VINYL_PROMPTS[category] || VINYL_PROMPTS['doux'];
    
    updateState(vinylId, {
      isGenerating: true,
      progress: 5,
      error: null,
      isFallback: false
    });

    try {
      logger.info(`Starting Suno generation for vinyl: ${title}`, { category, vinylId }, 'MUSIC');

      // Call Suno API
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate',
          prompt: config.prompt,
          style: config.style,
          mood: config.mood,
          title: title,
          instrumental: true
        }
      });

      if (error) throw error;

      const responseData = data?.data || data;
      const audioUrl = responseData?.audio_url || responseData?.audioUrl;
      const taskId = responseData?.taskId || responseData?.id;
      const isFallback = responseData?.isFallback === true;

      // If we got a direct URL (fallback or instant)
      if (audioUrl) {
        updateState(vinylId, {
          isGenerating: false,
          progress: 100,
          isFallback
        });
        
        if (!isFallback) {
          toast({
            title: "🎵 Musique générée !",
            description: `"${title}" est prête à jouer`,
          });
        }
        
        return audioUrl;
      }

      // If we got a taskId, poll for completion
      if (taskId && !taskId.startsWith('fallback-')) {
        updateState(vinylId, { progress: 10 });
        
        toast({
          title: "🎹 Génération en cours...",
          description: `Création de "${title}" via IA`,
        });

        const generatedUrl = await pollForCompletion(taskId, vinylId);
        
        if (generatedUrl) {
          updateState(vinylId, {
            isGenerating: false,
            progress: 100,
            isFallback: false
          });
          
          toast({
            title: "🎵 Musique générée !",
            description: `"${title}" est prête à jouer`,
          });
          
          return generatedUrl;
        }
      }

      // Fallback if nothing worked
      throw new Error('No audio URL returned');

    } catch (err) {
      logger.warn(`Suno generation failed for ${vinylId}, using fallback`, err as Error, 'MUSIC');
      
      const fallbackUrl = FALLBACK_URLS[category] || FALLBACK_URLS['doux'];
      
      updateState(vinylId, {
        isGenerating: false,
        progress: 100,
        error: null, // Don't show error, we have fallback
        isFallback: true
      });

      toast({
        title: "Mode démo",
        description: "Lecture d'une piste de démonstration",
        variant: "default"
      });

      return fallbackUrl;
    } finally {
      delete abortControllers.current[vinylId];
    }
  }, [toast, updateState, pollForCompletion]);

  const cancelGeneration = useCallback((vinylId: string) => {
    if (abortControllers.current[vinylId]) {
      abortControllers.current[vinylId].abort();
      delete abortControllers.current[vinylId];
    }
    updateState(vinylId, {
      isGenerating: false,
      progress: 0,
      error: null
    });
  }, [updateState]);

  return {
    generateForVinyl,
    generationState,
    cancelGeneration
  };
}
