import { useState, useCallback } from 'react';
import { EmotionResult } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface UseEmotionAnalysisReturn {
  analyzeText: (text: string) => Promise<EmotionResult | null>;
  analyzeFacial: (imageData: Blob) => Promise<EmotionResult | null>;
  analyzeVoice: (audioData: Blob) => Promise<EmotionResult | null>;
  analyzeWithHume: (data: Blob | string, type: 'audio' | 'image' | 'text') => Promise<EmotionResult | null>;
  isAnalyzing: boolean;
  error: string | null;
  lastResult: EmotionResult | null;
  resetAnalysis: () => void;
}

export const useEmotionAnalysis = (): UseEmotionAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const resetAnalysis = useCallback(() => {
    setError(null);
    setLastResult(null);
    setIsAnalyzing(false);
  }, []);

  const analyzeText = useCallback(async (text: string): Promise<EmotionResult | null> => {
    if (!text.trim()) return null;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call Lovable AI-powered emotion analysis (Gemini 2.5 Flash)
      const { data, error: apiError } = await supabase.functions.invoke('emotion-analysis', {
        body: {
          text,
          language: 'fr'
        }
      });

      if (apiError) throw apiError;

      const result: EmotionResult = {
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0.75,
        valence: data.valence || 0.5,
        arousal: data.arousal || 0.5,
        timestamp: new Date(),
        source: 'text',
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse du texte';
      setError(errorMessage);
      logger.error('Text analysis error', err as Error, 'SCAN');

      const fallbackResult: EmotionResult = {
        emotion: 'neutral',
        confidence: 0.5,
        valence: 0.5,
        arousal: 0.5,
        timestamp: new Date(),
        source: 'text',
      };

      setLastResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeFacial = useCallback(async (imageData: Blob): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert blob to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(',')[1]);
        };
        reader.readAsDataURL(imageData);
      });

      const { data, error: apiError } = await supabase.functions.invoke('hume-analysis', {
        body: {
          audioData: base64,
          analysisType: 'facial'
        }
      });

      if (apiError) throw apiError;

      // Parse Hume AI Batch API response
      const analysis = data.analysis;

      // Convert emotions array to object format
      const emotionsObj: Record<string, number> = {};
      if (analysis.emotions) {
        analysis.emotions.forEach((e: any) => {
          emotionsObj[e.name] = e.confidence;
        });
      }

      const result: EmotionResult = {
        emotion: analysis.dominant_emotion || 'neutral',
        confidence: analysis.confidence_score || 0.7,
        valence: analysis.valence || 0.5,
        arousal: analysis.arousal || 0.5,
        timestamp: new Date(),
        source: 'facial',
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse faciale';
      setError(errorMessage);
      logger.error('Facial analysis error', err as Error, 'SCAN');
      
      const fallbackResult: EmotionResult = {
        emotion: 'neutral',
        confidence: 0.6,
        valence: 0.5,
        arousal: 0.5,
        timestamp: new Date(),
        source: 'facial',
      };
      
      setLastResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeVoice = useCallback(async (audioData: Blob): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert blob to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(',')[1]);
        };
        reader.readAsDataURL(audioData);
      });

      // First get transcription
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64 }
      });

      if (transcriptionError) throw transcriptionError;

      // Then analyze emotions from voice using Hume AI
      const { data, error: apiError } = await supabase.functions.invoke('hume-analysis', {
        body: {
          audioData: base64,
          analysisType: 'voice'
        }
      });

      if (apiError) throw apiError;

      // Parse Hume AI Batch API response
      const analysis = data.analysis;

      // Convert emotions array to object format
      const emotionsObj: Record<string, number> = {};
      if (analysis.emotions) {
        analysis.emotions.forEach((e: any) => {
          emotionsObj[e.name] = e.confidence;
        });
      }

      const result: EmotionResult = {
        emotion: analysis.dominant_emotion || 'neutral',
        confidence: analysis.confidence_score || 0.75,
        valence: analysis.valence || 0.5,
        arousal: analysis.arousal || 0.5,
        timestamp: new Date(),
        source: 'voice',
        transcription: transcriptionData?.text || '',
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse vocale';
      setError(errorMessage);
      logger.error('Voice analysis error', err as Error, 'SCAN');
      
      const fallbackResult: EmotionResult = {
        emotion: 'neutral',
        confidence: 0.65,
        valence: 0.5,
        arousal: 0.5,
        timestamp: new Date(),
        source: 'voice',
      };
      
      setLastResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeWithHume = useCallback(async (data: Blob | string, type: 'audio' | 'image' | 'text'): Promise<EmotionResult | null> => {
    switch (type) {
      case 'text':
        return analyzeText(data as string);
      case 'image':
        return analyzeFacial(data as Blob);
      case 'audio':
        return analyzeVoice(data as Blob);
      default:
        setError('Type d\'analyse non supporté');
        return null;
    }
  }, [analyzeText, analyzeFacial, analyzeVoice]);

  return {
    analyzeText,
    analyzeFacial,
    analyzeVoice,
    analyzeWithHume,
    isAnalyzing,
    error,
    lastResult,
    resetAnalysis
  };
};
