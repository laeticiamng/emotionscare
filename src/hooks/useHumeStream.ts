import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface EmotionData {
  valence: number;
  arousal: number;
  dominantEmotion: string;
  confidence: number;
  timestamp: number;
}

/**
 * Hook pour l'analyse émotionnelle via Edge Functions
 * Sécurisé - pas de clé API côté client
 */
export const useHumeStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      setIsConnected(true);
      setError(null);

      toast({
        title: '🎭 Analyse émotionnelle activée',
        description: 'Votre état émotionnel peut maintenant être analysé',
      });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMsg);
      toast({
        title: '❌ Erreur de connexion',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsConnected(false);
    setCurrentEmotion(null);
    
    toast({
      title: 'Analyse désactivée',
      description: 'L\'analyse émotionnelle a été arrêtée',
    });
  }, []);

  /**
   * Analyse un chunk audio via Edge Function
   */
  const sendAudioChunk = useCallback(async (audioData: ArrayBuffer) => {
    if (!isConnected || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      // Convertir en base64
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(audioData))
      );
      
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          audio: base64Audio, 
          analysisType: 'prosody' 
        }
      });
      
      if (error) throw error;
      
      if (data?.emotions) {
        const emotion: EmotionData = {
          valence: data.valence || 0.5,
          arousal: data.arousal || 0.5,
          dominantEmotion: data.emotions[0]?.name || 'neutral',
          confidence: data.emotions[0]?.score || 0.5,
          timestamp: Date.now()
        };
        setCurrentEmotion(emotion);
      }
    } catch (err) {
      logger.error('Audio analysis error', err instanceof Error ? err : new Error(String(err)), 'SCAN');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isConnected, isAnalyzing]);

  /**
   * Analyse du texte via Edge Function
   */
  const sendText = useCallback(async (text: string) => {
    if (!isConnected || isAnalyzing || !text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          text, 
          analysisType: 'text' 
        }
      });
      
      if (error) throw error;
      
      if (data?.emotions) {
        const emotion: EmotionData = {
          valence: data.valence || 0.5,
          arousal: data.arousal || 0.5,
          dominantEmotion: data.emotions[0]?.name || 'neutral',
          confidence: data.emotions[0]?.score || 0.5,
          timestamp: Date.now()
        };
        setCurrentEmotion(emotion);
      }
    } catch (err) {
      logger.error('Text analysis error', err instanceof Error ? err : new Error(String(err)), 'SCAN');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isConnected, isAnalyzing]);

  const getSmoothedEmotion = useCallback(() => {
    return currentEmotion 
      ? { valence: currentEmotion.valence, arousal: currentEmotion.arousal }
      : { valence: 0.5, arousal: 0.5 };
  }, [currentEmotion]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    currentEmotion,
    error,
    isAnalyzing,
    connect,
    disconnect,
    sendAudioChunk,
    sendText,
    getSmoothedEmotion
  };
};
