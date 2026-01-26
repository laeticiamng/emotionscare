/**
 * useEmotionScan - Hook principal pour l'analyse des émotions
 * Supporte les analyses textuelles, vocales et visuelles
 */

import { useState, useCallback } from 'react';
import { EmotionResult, normalizeEmotionResult } from '@/types/emotion-unified';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export type ScanType = 'text' | 'voice' | 'image' | 'camera';

interface ScanOptions {
  language?: string;
  saveToHistory?: boolean;
  context?: string;
}

export const useEmotionScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Analyse textuelle
  const analyzeText = useCallback(async (text: string, options: ScanOptions = {}): Promise<EmotionResult> => {
    const { language = 'fr' } = options;

    const { data, error } = await supabase.functions.invoke('emotion-analysis', {
      body: { text, language }
    });

    if (error) {
      throw new Error(error.message || 'Erreur d\'analyse textuelle');
    }

    if (!data) {
      throw new Error('Aucune donnée retournée par l\'analyse');
    }

    return normalizeEmotionResult({
      id: crypto.randomUUID(),
      emotion: data.emotion || 'neutre',
      valence: (data.valence ?? 0.5) * 100,
      arousal: (data.arousal ?? 0.5) * 100,
      confidence: (data.confidence ?? 0.7) * 100,
      source: 'text',
      timestamp: new Date().toISOString(),
      summary: data.summary,
      emotions: data.emotions || {},
      metadata: { latency_ms: data.latency_ms }
    });
  }, []);

  // Analyse vocale
  const analyzeVoice = useCallback(async (audioBlob: Blob, _options: ScanOptions = {}): Promise<EmotionResult> => {
    // Convertir en base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(audioBlob);
    const audioBase64 = await base64Promise;

    // Utiliser analyze-voice-hume qui transcrit puis analyse
    const { data, error } = await supabase.functions.invoke('analyze-voice-hume', {
      body: { audioBase64 }
    });

    if (error) {
      throw new Error(error.message || 'Erreur d\'analyse vocale');
    }

    return normalizeEmotionResult({
      id: crypto.randomUUID(),
      emotion: data?.emotion || 'neutre',
      valence: (data?.valence ?? 0.5) * 100,
      arousal: (data?.arousal ?? 0.5) * 100,
      confidence: (data?.confidence ?? 0.6) * 100,
      source: 'voice',
      timestamp: new Date().toISOString(),
      summary: data?.transcript ? `"${data.transcript.substring(0, 100)}..."` : undefined,
      emotions: data?.emotions || {}
    });
  }, []);

  // Analyse d'image (webcam ou upload)
  const analyzeImage = useCallback(async (imageData: string, _options: ScanOptions = {}): Promise<EmotionResult> => {
    // Extraire le base64 si c'est un data URL
    const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;

    const { data, error } = await supabase.functions.invoke('hume-analysis', {
      body: { 
        imageBase64: base64,
        analysisType: 'facial'
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur d\'analyse faciale');
    }

    // Normaliser la réponse de Hume (structure analysis)
    const analysis = data?.analysis || data;
    const emotionsList = analysis?.emotions || [];
    const dominantEmotion = emotionsList[0]?.name || analysis?.dominant_emotion || 'neutre';
    const confidence = emotionsList[0]?.confidence || analysis?.confidence_score || 0.7;
    
    // Calculer valence et arousal depuis les émotions détectées
    const positiveEmotions = ['joy', 'happiness', 'excitement', 'contentment', 'amusement', 'love'];
    const highArousalEmotions = ['excitement', 'anger', 'fear', 'surprise', 'anxiety'];
    
    const emotionsObj: Record<string, number> = {};
    let valenceScore = 0.5;
    let arousalScore = 0.5;
    
    emotionsList.forEach((e: { name: string; confidence: number }) => {
      emotionsObj[e.name] = e.confidence;
      if (positiveEmotions.includes(e.name.toLowerCase())) {
        valenceScore = Math.max(valenceScore, 0.5 + e.confidence * 0.5);
      }
      if (highArousalEmotions.includes(e.name.toLowerCase())) {
        arousalScore = Math.max(arousalScore, 0.5 + e.confidence * 0.5);
      }
    });

    return normalizeEmotionResult({
      id: crypto.randomUUID(),
      emotion: dominantEmotion,
      valence: valenceScore * 100,
      arousal: arousalScore * 100,
      confidence: confidence * 100,
      source: 'facial',
      timestamp: new Date().toISOString(),
      summary: `Émotion détectée: ${dominantEmotion}`,
      emotions: emotionsObj
    });
  }, []);

  // Fonction principale de scan
  const scanEmotion = useCallback(async (
    type: ScanType,
    data: string | Blob,
    options: ScanOptions = {}
  ): Promise<EmotionResult> => {
    setIsScanning(true);
    setError(null);

    try {
      let result: EmotionResult;

      switch (type) {
        case 'text':
          if (typeof data !== 'string') throw new Error('Le texte doit être une chaîne');
          result = await analyzeText(data, options);
          break;

        case 'voice':
          if (!(data instanceof Blob)) throw new Error('L\'audio doit être un Blob');
          result = await analyzeVoice(data, options);
          break;

        case 'image':
        case 'camera':
          if (typeof data !== 'string') throw new Error('L\'image doit être en base64');
          result = await analyzeImage(data, options);
          break;

        default:
          throw new Error(`Type de scan non supporté: ${type}`);
      }

      setLastResult(result);
      
      // Sauvegarder dans l'historique si demandé
      if (options.saveToHistory !== false) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('clinical_signals').insert({
            user_id: user.id,
            domain: 'emotional',
            level: Math.round((result.valence || 50) / 25),
            source_instrument: `scan_${type}`,
            window_type: 'instant',
            module_context: 'scan',
            metadata: {
              valence: result.valence,
              arousal: result.arousal,
              emotion: result.emotion,
              confidence: result.confidence,
              summary: result.summary
            },
            expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          window.dispatchEvent(new CustomEvent('scan-saved'));
        }
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      logger.error('[useEmotionScan] Error:', err, 'HOOK');
      
      toast({
        title: 'Erreur d\'analyse',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw err;
    } finally {
      setIsScanning(false);
    }
  }, [analyzeText, analyzeVoice, analyzeImage, toast]);

  // Reset
  const reset = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return {
    scanEmotion,
    analyzeText,
    analyzeVoice,
    analyzeImage,
    isScanning,
    lastResult,
    error,
    reset
  };
};
