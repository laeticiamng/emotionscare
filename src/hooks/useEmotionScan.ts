
import { useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import { normalizeEmotionResult } from '@/utils/emotionCompatibility';

/**
 * Custom hook to manage emotion scanning functionality
 */
export function useEmotionScan() {
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles text-based emotion scanning
   */
  const scanTextEmotion = async (text: string) => {
    if (!text.trim()) {
      setError("Veuillez entrer du texte pour l'analyse");
      return;
    }

    setIsScanning(true);
    setError(null);
    
    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock result
      const mockResult: Partial<EmotionResult> = {
        id: `scan-${Date.now()}`,
        emotion: getRandomEmotion(),
        confidence: 0.7 + Math.random() * 0.25,
        intensity: 0.5 + Math.random() * 0.4,
        emojis: ['😊'],
        text,
        timestamp: new Date().toISOString(),
        source: 'text'
      };
      
      const normalizedResult = normalizeEmotionResult(mockResult);
      setScanResult(normalizedResult);
    } catch (err: any) {
      console.error('Error scanning text emotion:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'analyse');
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * Handles voice-based emotion scanning
   */
  const scanVoiceEmotion = async (audioBlob?: Blob) => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const mockResult: Partial<EmotionResult> = {
        id: `scan-${Date.now()}`,
        emotion: getRandomEmotion(),
        confidence: 0.6 + Math.random() * 0.3,
        intensity: 0.4 + Math.random() * 0.5,
        emojis: ['😊'],
        timestamp: new Date().toISOString(),
        source: 'voice',
        transcript: "Voici ce que j'ai dit pendant l'enregistrement."
      };
      
      const normalizedResult = normalizeEmotionResult(mockResult);
      setScanResult(normalizedResult);
    } catch (err: any) {
      console.error('Error scanning voice emotion:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'analyse');
    } finally {
      setIsScanning(false);
    }
  };

  // Helper function to get random emotions for mock data
  function getRandomEmotion(): string {
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral', 'calm'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  return {
    scanResult,
    isScanning,
    error,
    scanTextEmotion,
    scanVoiceEmotion,
    resetScan: () => setScanResult(null)
  };
}

export default useEmotionScan;
