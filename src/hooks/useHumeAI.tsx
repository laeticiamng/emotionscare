
import { useState } from 'react';
import { Emotion } from '@/types';

export type EmotionSource = 'audio' | 'text' | 'camera' | 'manual' | 'voice' | 'facial';

interface UseHumeAIProps {
  onEmotionDetected?: (emotion: Emotion) => void;
}

export const useHumeAI = ({ onEmotionDetected }: UseHumeAIProps = {}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState<Emotion | null>(null);

  // Mock function to analyze audio
  const analyzeAudio = async (audioBlob: Blob): Promise<Emotion> => {
    try {
      setIsAnalyzing(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock detected emotion
      const detectedEmotion: Emotion = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        emotion: ['joy', 'calm', 'neutral'][Math.floor(Math.random() * 3)],
        sentiment: Math.random() * 10,
        anxiety: Math.floor(Math.random() * 10),
        energy: Math.floor(Math.random() * 10),
        score: Math.random() * 10,
        intensity: Math.random()
      };

      setLastDetectedEmotion(detectedEmotion);
      if (onEmotionDetected) {
        onEmotionDetected(detectedEmotion);
      }
      return detectedEmotion;
    } catch (err) {
      setError('Failed to analyze audio');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Mock function to analyze facial expression
  const analyzeFacial = async (imageBlob: Blob): Promise<Emotion> => {
    try {
      setIsAnalyzing(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock detected emotion
      const detectedEmotion: Emotion = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        emotion: ['joy', 'calm', 'neutral'][Math.floor(Math.random() * 3)],
        sentiment: Math.random() * 10,
        anxiety: Math.floor(Math.random() * 10),
        energy: Math.floor(Math.random() * 10),
        score: Math.random() * 10,
        intensity: Math.random()
      };

      setLastDetectedEmotion(detectedEmotion);
      if (onEmotionDetected) {
        onEmotionDetected(detectedEmotion);
      }
      return detectedEmotion;
    } catch (err) {
      setError('Failed to analyze facial expression');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Common method to analyze emotions from any source
  const analyzeEmotion = async (
    data: Blob | string,
    source: EmotionSource = 'text'
  ): Promise<Emotion | null> => {
    try {
      setIsAnalyzing(true);
      setError(null);

      let result: Emotion;
      
      if (source === 'audio' || source === 'voice') {
        result = await analyzeAudio(data as Blob);
      } else if (source === 'facial' || source === 'camera') {
        result = await analyzeFacial(data as Blob);
      } else if (source === 'text') {
        // Mock text analysis
        result = {
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          emotion: data.toString().toLowerCase().includes('happy') ? 'joy' : 'neutral',
          sentiment: Math.random() * 10,
          anxiety: Math.floor(Math.random() * 10),
          energy: Math.floor(Math.random() * 10),
          score: Math.random() * 10,
          intensity: Math.random(),
          text: data.toString()
        };
      } else if (source === 'manual') {
        result = {
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          emotion: data.toString(),
          sentiment: Math.random() * 10,
          anxiety: Math.floor(Math.random() * 10),
          energy: Math.floor(Math.random() * 10),
          score: Math.random() * 10,
          intensity: Math.random()
        };
      } else {
        throw new Error(`Unsupported emotion source: ${source}`);
      }

      setLastDetectedEmotion(result);
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error(`Error analyzing emotion (${source}):`, err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeEmotion,
    analyzeAudio,
    analyzeFacial,
    lastDetectedEmotion,
    error,
    clearError: () => setError(null)
  };
};
