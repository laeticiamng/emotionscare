
import { useState } from 'react';
import { useToast } from './use-toast';
import { EmotionResult } from '@/types/emotions';

// Mock API response for Hume AI analysis
interface MockHumeAIResponse {
  emotions: {
    name: string;
    score: number;
  }[];
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  language: {
    detected: string;
    confidence: number;
  };
}

export const useHumeAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const { toast } = useToast();

  // Simulated analysis function for text
  const analyzeText = async (text: string): Promise<EmotionResult> => {
    if (!text || text.trim() === '') {
      throw new Error('Text input is required for analysis');
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolver => setTimeout(resolver, 1500));
      
      // Mock response based on text content
      const lowerText = text.toLowerCase();
      let primaryEmotion = 'neutral';
      let confidence = 0.7;
      
      if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
        primaryEmotion = 'joy';
        confidence = 0.85;
      } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('unhappy')) {
        primaryEmotion = 'sadness';
        confidence = 0.8;
      } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
        primaryEmotion = 'anger';
        confidence = 0.75;
      } else if (lowerText.includes('scared') || lowerText.includes('afraid') || lowerText.includes('anxious')) {
        primaryEmotion = 'fear';
        confidence = 0.7;
      } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
        primaryEmotion = 'calm';
        confidence = 0.9;
      }
      
      const emotionResult: EmotionResult = {
        emotion: primaryEmotion,
        confidence: confidence,
        timestamp: new Date().toISOString(),
        source: 'text',
        textInput: text
      };
      
      setResult(emotionResult);
      return emotionResult;
    } catch (error) {
      console.error('Error analyzing text with Hume AI:', error);
      toast({
        title: 'Analyse échouée',
        description: 'Impossible d\'analyser le texte. Veuillez réessayer.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Simulated analysis function for audio
  const analyzeAudio = async (audioBlob: Blob): Promise<EmotionResult> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolver => setTimeout(resolver, 2000));
      
      // Create a mock audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Mock emotions with random values for demo
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = 0.5 + Math.random() * 0.4; // Between 0.5 and 0.9
      
      const emotionResult: EmotionResult = {
        emotion: randomEmotion,
        confidence: randomConfidence,
        timestamp: new Date().toISOString(),
        source: 'audio',
        audioUrl
      };
      
      setResult(emotionResult);
      return emotionResult;
    } catch (error) {
      console.error('Error analyzing audio with Hume AI:', error);
      toast({
        title: 'Analyse échouée',
        description: 'Impossible d\'analyser l\'audio. Veuillez réessayer.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Simulated analysis function for facial expression
  const analyzeFacial = async (imageBlob: Blob): Promise<EmotionResult> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolver => setTimeout(resolver, 1800));
      
      // Mock emotions with random values for demo
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = 0.6 + Math.random() * 0.3; // Between 0.6 and 0.9
      
      const emotionResult: EmotionResult = {
        emotion: randomEmotion,
        confidence: randomConfidence,
        timestamp: new Date().toISOString(),
        source: 'facial',
        facialExpression: randomEmotion
      };
      
      setResult(emotionResult);
      return emotionResult;
    } catch (error) {
      console.error('Error analyzing facial expression with Hume AI:', error);
      toast({
        title: 'Analyse échouée',
        description: 'Impossible d\'analyser l\'expression faciale. Veuillez réessayer.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeText,
    analyzeAudio,
    analyzeFacial,
    isAnalyzing,
    result,
    resetResult: () => setResult(null)
  };
};

export default useHumeAI;
