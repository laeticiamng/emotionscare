import { useState, useCallback } from 'react';
import { EmotionResult } from '@/types';

export const useEmotionScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const scanEmotion = useCallback(async (type: 'text' | 'voice' | 'image', data: any): Promise<EmotionResult> => {
    setIsScanning(true);
    
    try {
      // Simulation d'analyse émotionnelle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mapper le type vers EmotionSource
      const sourceMap: Record<string, 'facial_analysis' | 'voice_analysis' | 'text_analysis'> = {
        text: 'text_analysis',
        voice: 'voice_analysis',
        image: 'facial_analysis'
      };
      
      const result: EmotionResult = {
        id: Math.random().toString(36).substr(2, 9),
        emotion: 'happy',
        confidence: 0.85,
        intensity: 0.6,
        source: sourceMap[type],
        timestamp: new Date(),
        vector: {
          valence: 0.7,
          arousal: 0.6,
          dominance: 0.5
        },
        details: { type, data }
      };
      
      setLastResult(result);
      return result;
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
