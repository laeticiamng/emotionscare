import { useState, useCallback } from 'react';
import { EmotionResult, normalizeEmotionResult } from '@/types/emotion-unified';
import { supabase } from '@/integrations/supabase/client';

export const useEmotionScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const scanEmotion = useCallback(async (type: 'text' | 'voice' | 'image', data: any): Promise<EmotionResult> => {
    setIsScanning(true);
    
    try {
      // Mapper le type vers la fonction appropriée
      if (type === 'text') {
        // Appeler l'edge function d'analyse textuelle
        const { data: analysisData, error } = await supabase.functions.invoke('emotion-analysis', {
          body: { text: data, language: 'fr' }
        });

        if (error) {
          console.error('[useEmotionScan] Text analysis error:', error);
          throw new Error(error.message || 'Failed to analyze text');
        }

        if (!analysisData) {
          throw new Error('No data returned from text analysis');
        }

        const result: EmotionResult = normalizeEmotionResult({
          id: crypto.randomUUID(),
          emotion: analysisData.emotion || 'neutre',
          valence: (analysisData.valence || 0.5) * 100,
          arousal: (analysisData.arousal || 0.5) * 100,
          confidence: (analysisData.confidence || 0.7) * 100,
          source: 'text',
          timestamp: new Date().toISOString(),
          summary: analysisData.summary,
          emotions: analysisData.emotions || {},
          metadata: {
            latency_ms: analysisData.latency_ms
          }
        });
        
        setLastResult(result);
        return result;
        
      } else {
        // Pour voice et image, retourner une erreur pour l'instant
        throw new Error(`Analysis type '${type}' not yet implemented in this hook. Use specific components instead.`);
      }
      
    } catch (error) {
      console.error('[useEmotionScan] Error:', error);
      throw error;
    } finally {
      setIsScanning(false);
    }
  }, []);

  return {
    scanEmotion,
    isScanning,
    lastResult
  };
};
