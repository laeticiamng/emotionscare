import { useState, useCallback } from 'react';
import { EmotionResult } from '@/types/emotion';
import { normalizeEmotionResult } from '@/utils/emotionCompatibility';

export function useEmotionScan() {
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Simulate an API call to emotion detection service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a properly normalized emotion result
      const mockResult = normalizeEmotionResult({
        id: `emotion-${Date.now()}`,
        emotion: 'happy',
        confidence: 0.85,
        emojis: ['😊', '😄'],
        score: 78,
        intensity: 0.7, // Using number directly
        text: 'User expression analysis',
        feedback: 'You seem to be in a good mood',
        timestamp: new Date().toISOString()
      });
      
      setResult(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during scan'));
      console.error('Error during emotion scan:', err);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const resetScan = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const mockEmotionDetection = useCallback((emotion: string) => {
    setIsScanning(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Create a normalized mock result
      const mockResult = normalizeEmotionResult({
        id: `mock-${Date.now()}`,
        emotion,
        confidence: 0.9,
        emojis: ['😊', '😃'],
        score: 85,
        intensity: 0.8, // Using number directly
        text: 'Mock detection',
        timestamp: new Date().toISOString()
      });
      
      setResult(mockResult);
      setIsScanning(false);
    }, 1000);
  }, []);

  return {
    result,
    isScanning,
    error,
    startScan,
    resetScan,
    mockEmotionDetection,
  };
}
