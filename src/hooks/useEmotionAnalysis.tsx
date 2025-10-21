// @ts-nocheck
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
      const { data, error: apiError } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: {
          type: 'text',
          data: text,
          options: {
            language: 'fr',
            includeRecommendations: true
          }
        }
      });

      if (apiError) throw apiError;

      const result: EmotionResult = {
        emotion: data.dominantEmotion || 'neutral',
        confidence: data.confidence || 0.75,
        timestamp: new Date().toISOString(),
        source: 'text',
        emotions: data.emotions || {},
        sentiment: data.sentiment || 'neutral',
        recommendations: data.recommendations || []
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse du texte';
      setError(errorMessage);
      logger.error('Text analysis error', err as Error, 'SCAN');
      
      // Fallback result
      const fallbackResult: EmotionResult = {
        emotion: 'neutral',
        confidence: 0.5,
        timestamp: new Date().toISOString(),
        source: 'text',
        emotions: { neutral: 0.5, calm: 0.3, content: 0.2 },
        sentiment: 'neutral'
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
          type: 'facial',
          image: base64,
          options: {
            returnFaceDetails: true,
            language: 'fr'
          }
        }
      });

      if (apiError) throw apiError;

      const result: EmotionResult = {
        emotion: data.dominantEmotion || 'neutral',
        confidence: data.confidence || 0.7,
        timestamp: new Date().toISOString(),
        source: 'facial',
        emotions: data.emotions || {},
        sentiment: data.sentiment || 'neutral',
        facialFeatures: data.facialFeatures
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse faciale';
      setError(errorMessage);
      logger.error('Facial analysis error', err as Error, 'SCAN');
      
      // Fallback result
      const fallbackResult: EmotionResult = {
        emotion: 'neutral',
        confidence: 0.6,
        timestamp: new Date().toISOString(),
        source: 'facial',
        emotions: { neutral: 0.6, calm: 0.4 },
        sentiment: 'neutral'
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

      // Then analyze emotions from voice
      const { data, error: apiError } = await supabase.functions.invoke('hume-analysis', {
        body: {
          type: 'voice',
          audio: base64,
          text: transcriptionData.text,
          options: {
            language: 'fr',
            includeProsody: true
          }
        }
      });

      if (apiError) throw apiError;

      const result: EmotionResult = {
        emotion: data.dominantEmotion || 'neutral',
        confidence: data.confidence || 0.75,
        timestamp: new Date().toISOString(),
        source: 'voice',
        emotions: data.emotions || {},
        sentiment: data.sentiment || 'neutral',
        transcription: transcriptionData.text,
        prosody: data.prosody
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse vocale';
      setError(errorMessage);
      logger.error('Voice analysis error', err as Error, 'SCAN');
      
      // Fallback result
      const fallbackResult: EmotionResult = {
        emotion: 'neutral',
        confidence: 0.65,
        timestamp: new Date().toISOString(),
        source: 'voice',
        emotions: { neutral: 0.65, calm: 0.35 },
        sentiment: 'neutral'
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
