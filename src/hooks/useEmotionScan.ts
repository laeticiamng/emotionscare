
import { useState } from 'react';
import { EmotionScanOptions, EmotionResult } from '@/types/emotions';

export const useEmotionScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanEmotion = async (options: EmotionScanOptions): Promise<EmotionResult> => {
    setIsScanning(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock emotion analysis result
      const mockResult: EmotionResult = {
        id: Date.now().toString(),
        userId: 'user-1',
        timestamp: new Date(),
        overallMood: 'neutral',
        emotions: [
          { emotion: 'calm', confidence: 0.7, intensity: 0.6 },
          { emotion: 'focused', confidence: 0.5, intensity: 0.4 }
        ],
        dominantEmotion: 'calm',
        confidence: 0.75,
        source: options.type,
        recommendations: [
          'Prenez quelques minutes pour respirer profondément',
          'Écoutez de la musique relaxante'
        ]
      };

      return mockResult;
    } catch (err) {
      setError('Erreur lors de l\'analyse émotionnelle');
      throw err;
    } finally {
      setIsScanning(false);
    }
  };

  return {
    scanEmotion,
    isScanning,
    error
  };
};
