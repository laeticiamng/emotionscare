
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Mock Hume AI service
const mockAnalyzeEmotion = async (input: string | File): Promise<EmotionResult> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a random emotion with confidence
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = 0.5 + Math.random() * 0.5; // Between 0.5 and 1.0
  const intensity = 0.3 + Math.random() * 0.7; // Between 0.3 and 1.0
  
  return {
    id: uuidv4(),
    emotion: randomEmotion,
    confidence,
    intensity,
    timestamp: new Date().toISOString(),
    source: typeof input === 'string' ? 'text' : 'audio',
    recommendations: [
      { title: 'Take a break', description: 'Step away from your work for 5 minutes' },
      { title: 'Deep breathing', description: 'Try 5 deep breaths' },
    ],
    emotions: {
      joy: Math.random(),
      sadness: Math.random(),
      anger: Math.random(),
      fear: Math.random(),
      surprise: Math.random(),
    }
  };
};

export const useHumeAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  // Analyze emotions from text
  const analyzeText = async (text: string): Promise<EmotionResult> => {
    if (!text.trim()) {
      const error = new Error('Text input cannot be empty');
      setError(error);
      throw error;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, make API call to Hume AI
      const result = await mockAnalyzeEmotion(text);
      
      // Add text-specific fields
      const finalResult: EmotionResult = {
        ...result,
        textInput: text
      };

      setLastResult(finalResult);
      return finalResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze text');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Analyze emotions from audio
  const analyzeAudio = async (audioFile: File): Promise<EmotionResult> => {
    if (!audioFile) {
      const error = new Error('Audio file is required');
      setError(error);
      throw error;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, make API call to Hume AI
      const result = await mockAnalyzeEmotion(audioFile);
      
      // Add audio-specific fields
      const finalResult: EmotionResult = {
        ...result,
        audioUrl: URL.createObjectURL(audioFile)
      };

      setLastResult(finalResult);
      return finalResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze audio');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Analyze emotions from facial expressions
  const analyzeFacial = async (imageFile: File): Promise<EmotionResult> => {
    if (!imageFile) {
      const error = new Error('Image file is required');
      setError(error);
      throw error;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, make API call to Hume AI
      const result = await mockAnalyzeEmotion(imageFile);
      
      // Add facial-specific fields
      const finalResult: EmotionResult = {
        ...result,
        facialExpression: result.emotion
      };

      setLastResult(finalResult);
      return finalResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze facial expression');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeText,
    analyzeAudio,
    analyzeFacial,
    loading,
    error,
    lastResult
  };
};

export default useHumeAI;
