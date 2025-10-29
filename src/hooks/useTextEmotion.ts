import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TextEmotionResult } from '@/types/realtime-emotion';

export const useTextEmotion = () => {
  const [latency, setLatency] = useState(0);
  const [lastResult, setLastResult] = useState<TextEmotionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = useCallback(async (text: string) => {
    if (!text || text.trim().length < 3) return;

    setIsAnalyzing(true);
    
    try {
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: text.trim() }
      });

      if (error) throw error;

      const result: TextEmotionResult = {
        ...data,
        timestamp: Date.now()
      };

      setLatency(Date.now() - startTime);
      setLastResult(result);

      return result;

    } catch (error) {
      console.error('[useTextEmotion] Error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    latency,
    lastResult,
    isAnalyzing,
    analyze
  };
};
