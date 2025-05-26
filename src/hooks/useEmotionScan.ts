
import { useState, useCallback } from 'react';
import { EmotionResult, EmotionScanParams } from '@/types/emotions';

export const useEmotionScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanEmotion = useCallback(async (params: EmotionScanParams): Promise<EmotionResult | null> => {
    setIsScanning(true);
    setError(null);

    try {
      // Simulation d'une analyse émotionnelle
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: EmotionResult = {
        id: Date.now().toString(),
        userId: 'current-user',
        timestamp: new Date(),
        overallMood: 'positive',
        emotions: [
          { emotion: 'joie', confidence: 0.8, intensity: 0.7 },
          { emotion: 'satisfaction', confidence: 0.6, intensity: 0.5 }
        ],
        dominantEmotion: 'joie',
        confidence: 0.8,
        source: params.type,
        recommendations: [
          'Continuez sur cette lancée positive',
          'Partagez votre bonne humeur avec vos proches'
        ],
        metadata: {
          inputLength: params.text?.length || 0,
          processingTime: 2000
        }
      };

      setResult(mockResult);
      return mockResult;
    } catch (err) {
      const errorMessage = 'Erreur lors de l\'analyse émotionnelle';
      setError(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    scanEmotion,
    isScanning,
    result,
    error,
    clearResult
  };
};
