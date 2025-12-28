// @ts-nocheck

import { useState, useCallback } from 'react';
import { EmotionResult, normalizeEmotionResult } from '@/types/emotion-unified';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const useHumeAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = useCallback(async (input: string | File): Promise<EmotionResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      if (typeof input === 'string') {
        // Analyse textuelle via edge function
        const { data, error: invokeError } = await supabase.functions.invoke('emotion-analysis', {
          body: { text: input, language: 'fr' }
        });

        if (invokeError) {
          throw new Error(invokeError.message || 'Erreur d\'analyse textuelle');
        }

        return normalizeEmotionResult({
          id: Date.now().toString(),
          emotion: data?.emotion || 'neutre',
          valence: (data?.valence || 0.5) * 100,
          arousal: (data?.arousal || 0.5) * 100,
          confidence: (data?.confidence || 0.7) * 100,
          source: 'text',
          timestamp: new Date().toISOString(),
          summary: data?.summary,
          emotions: data?.emotions || {}
        });
      } else {
        // Analyse d'image via edge function
        const base64 = await fileToBase64(input);
        
        const { data, error: invokeError } = await supabase.functions.invoke('analyze-image', {
          body: { imageBase64: base64 }
        });

        if (invokeError) {
          throw new Error(invokeError.message || 'Erreur d\'analyse d\'image');
        }

        return normalizeEmotionResult({
          id: Date.now().toString(),
          emotion: data?.emotion || 'neutre',
          valence: (data?.valence || 0.5) * 100,
          arousal: (data?.arousal || 0.5) * 100,
          confidence: (data?.confidence || 0.7) * 100,
          source: 'image',
          timestamp: new Date().toISOString(),
          summary: data?.summary,
          emotions: data?.emotions || {}
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d\'analyse';
      logger.error('[useHumeAI] Error:', err, 'HOOK');
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeFacialEmotion = useCallback(async (imageBase64: string): Promise<EmotionResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Appeler l'edge function d'analyse faciale
      const { data, error: invokeError } = await supabase.functions.invoke('hume-analysis', {
        body: { imageBase64, analysisType: 'facial' }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Erreur d\'analyse faciale');
      }

      // Extraire les résultats de l'analyse Hume
      const analysis = data?.analysis || data;
      const dominantEmotion = analysis?.dominant_emotion || 'neutre';
      const confidence = analysis?.confidence_score || 0.7;
      
      // Calculer valence/arousal basés sur l'émotion dominante
      const positiveEmotions = ['joy', 'joie', 'excitement', 'happiness', 'contentment', 'amusement', 'love'];
      const highArousalEmotions = ['excitement', 'anger', 'fear', 'surprise', 'anxiety'];
      
      const isPositive = positiveEmotions.includes(dominantEmotion.toLowerCase());
      const isHighArousal = highArousalEmotions.includes(dominantEmotion.toLowerCase());

      return normalizeEmotionResult({
        id: Date.now().toString(),
        emotion: dominantEmotion,
        valence: isPositive ? 70 + confidence * 25 : 30 - confidence * 20,
        arousal: isHighArousal ? 65 + confidence * 30 : 35 + confidence * 15,
        confidence: confidence * 100,
        source: 'facial',
        timestamp: new Date().toISOString(),
        summary: `Expression ${dominantEmotion} détectée`,
        emotions: analysis?.emotions?.reduce((acc: Record<string, number>, e: any) => {
          acc[e.name] = e.confidence * 100;
          return acc;
        }, {}) || {}
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d\'analyse faciale';
      logger.error('[useHumeAI] Facial error:', err, 'HOOK');
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeEmotion,
    analyzeFacialEmotion,
    isAnalyzing,
    error
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default useHumeAI;
