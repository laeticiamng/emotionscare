
// Hook React pour la musique antalgique EmotionsCare
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSunoMusic } from '@/hooks/api/useSunoMusic';

export interface AnalgesicTrackRequest {
  text: string;
  language?: "Français" | "English";
}

export interface AnalgesicTrackResponse {
  taskId: string;
  preset: {
    presetTag: string;
    tempo: number;
    instrumental: boolean;
    extraPrompt: string;
  };
  emotions: Array<{
    name: string;
    score: number;
    valence?: number;
    arousal?: number;
  }>;
}

export interface TherapeuticSequenceResponse {
  taskId: string;
  sequence: {
    steps: Array<{
      preset: string;
      tempo: number;
      duration: number;
      description: string;
    }>;
    totalDuration: number;
    startEmotion: string;
    targetEmotion: string;
  };
}

export const useAnalgesicMusic = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalgesicTrack = async (request: AnalgesicTrackRequest): Promise<AnalgesicTrackResponse | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎵 Génération track antalgique:', request);
      
      const { data, error: supabaseError } = await supabase.functions.invoke('emotionscare-analgesic', {
        body: {
          action: 'generate-analgesic-track',
          ...request
        }
      });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      console.log('✅ Track antalgique généré:', data);
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de génération antalgique';
      console.error('❌ Erreur génération antalgique:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTherapeuticSequence = async (request: AnalgesicTrackRequest): Promise<TherapeuticSequenceResponse | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎵 Génération séquence thérapeutique:', request);
      
      const { data, error: supabaseError } = await supabase.functions.invoke('emotionscare-analgesic', {
        body: {
          action: 'generate-therapeutic-sequence',
          ...request
        }
      });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      console.log('✅ Séquence thérapeutique générée:', data);
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de génération séquence';
      console.error('❌ Erreur génération séquence:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getTrackStatus = async (taskId: string) => {
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('emotionscare-analgesic', {
        body: {
          action: 'get-track-status',
          taskId
        }
      });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      return data;
    } catch (err) {
      console.error('❌ Erreur statut track:', err);
      return null;
    }
  };

  return {
    generateAnalgesicTrack,
    generateTherapeuticSequence,
    getTrackStatus,
    isGenerating,
    error
  };
};
