import { useState } from 'react';
import { Emotion, EmotionResult } from '@/types';

interface FacialEmotionData {
  emotion: string;
  confidence: number;
  triggers?: string[];
  recommendations?: string[];
}

interface TextEmotionData {
  emotion: string;
  confidence: number;
  sentiment: number;
  anxiety: number;
  energy: number;
}

export const useHumeAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const processText = async (text: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call the Hume AI API
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock emotion analysis based on text content
      const mockEmotion: TextEmotionData = {
        emotion: text.includes('happy') ? 'joy' : 
                text.includes('sad') ? 'sadness' : 
                text.includes('angry') ? 'anger' : 
                text.includes('scared') ? 'fear' : 'neutral',
        confidence: 0.85,
        sentiment: text.includes('happy') ? 0.8 : 
                  text.includes('sad') ? -0.6 : 
                  text.includes('angry') ? -0.8 : 0.1,
        anxiety: text.includes('worried') || text.includes('scared') ? 7 : 3,
        energy: text.includes('excited') || text.includes('angry') ? 8 : 5
      };
      
      const mockResult: EmotionResult = {
        id: 'emotion-' + Date.now(),
        emotion: mockEmotion.emotion,
        score: Math.round(Math.abs(mockEmotion.sentiment) * 10),
        confidence: mockEmotion.confidence,
        dominantEmotion: mockEmotion.emotion,
        text,
        timestamp: new Date().toISOString(),
        triggers: ['work stress', 'social media'],
        feedback: 'Try taking a short walk to clear your mind.'
      };
      
      setLastResult(mockResult);
      return mockResult;
    } finally {
      setIsProcessing(false);
    }
  };

  const processFacialExpression = async (imageData: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const result: EmotionResult = {
        id: 'facial-' + Date.now(),
        dominantEmotion: 'neutral',
        emotion: 'neutral',
        score: 5,
        confidence: 0.75,
        timestamp: new Date().toISOString(),
        feedback: 'Your facial expression appears neutral. Consider trying an activity to boost your mood.'
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  const processAudio = async (audioUrl: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock emotion detection from voice
      const emotions = ['calm', 'joy', 'neutral', 'sadness', 'anxiety'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const result: EmotionResult = {
        id: 'audio-' + Date.now(),
        dominantEmotion: randomEmotion,
        emotion: randomEmotion,
        score: Math.floor(Math.random() * 5) + 5, // 5-10
        confidence: 0.65 + Math.random() * 0.3, // 0.65-0.95
        timestamp: new Date().toISOString(),
        feedback: `Your voice indicates you're feeling ${randomEmotion}. Music matching this mood might help enhance your experience.`
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processEmojis = async (emojis: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple emoji to emotion mapping
      let emotion = 'neutral';
      let score = 5;
      
      if (emojis.includes('😊') || emojis.includes('😄') || emojis.includes('🙂')) {
        emotion = 'joy';
        score = 8;
      } else if (emojis.includes('😢') || emojis.includes('😭') || emojis.includes('😔')) {
        emotion = 'sadness';
        score = 3;
      } else if (emojis.includes('😡') || emojis.includes('😠')) {
        emotion = 'anger';
        score = 2;
      } else if (emojis.includes('😨') || emojis.includes('😰') || emojis.includes('😱')) {
        emotion = 'fear';
        score = 3;
      } else if (emojis.includes('😌') || emojis.includes('😇')) {
        emotion = 'calm';
        score = 7;
      }
      
      const result: EmotionResult = {
        id: 'emoji-' + Date.now(),
        dominantEmotion: emotion,
        emotion: emotion,
        score: score,
        confidence: 0.8,
        emojis: emojis,
        timestamp: new Date().toISOString(),
        feedback: `Your emoji selection suggests you're feeling ${emotion}.`
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    lastResult,
    processText,
    processFacialExpression,
    processAudio,
    processEmojis
  };
};

export default useHumeAI;
