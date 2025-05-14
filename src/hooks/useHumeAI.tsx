
import { useState } from 'react';
import { EmotionResult } from '@/types/emotion';

export const useHumeAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const processText = async (text: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    try {
      // For demo purposes, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock sentiment analysis
      const emotions = [
        { name: 'joy', probability: 0.1 },
        { name: 'sadness', probability: 0.05 },
        { name: 'anger', probability: 0.02 },
        { name: 'fear', probability: 0.03 },
        { name: 'neutral', probability: 0.7 },
      ];
      
      const dominant = emotions.reduce((max, emotion) => 
        emotion.probability > max.probability ? emotion : max, 
        emotions[0]
      );
      
      const result = {
        id: `text-${Date.now()}`,
        emotion: dominant.name,
        dominantEmotion: dominant.name,
        score: Math.round(dominant.probability * 100),
        confidence: dominant.probability,
        source: 'text',
        text: text,
        timestamp: new Date().toISOString(),
        anxiety: Math.floor(Math.random() * 70) + 30,
        recommendations: [
          "Prenez un moment pour respirer profondément",
          "Évaluez ce qui cause ces sentiments"
        ],
        feedback: "Votre texte indique un état émotionnel principalement neutre."
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error processing text:', error);
      return {
        emotion: 'error',
        score: 0,
        confidence: 0,
        source: 'error',
        timestamp: new Date().toISOString()
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const processFacialExpression = async (imageData: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    try {
      // For demo purposes, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emotions = ['neutral', 'happy', 'sad', 'surprised', 'angry'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
      
      const result = {
        id: `facial-${Date.now()}`,
        emotion: randomEmotion,
        dominantEmotion: randomEmotion,
        score: Math.round(confidence * 100),
        confidence: confidence,
        source: 'facial',
        timestamp: new Date().toISOString(),
        anxiety: Math.floor(Math.random() * 70) + 30,
        recommendations: [
          "Prenez conscience de votre expression faciale",
          "Essayez de détendre les muscles de votre visage"
        ],
        feedback: `Votre visage exprime principalement l'émotion: ${randomEmotion}`
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error processing facial expression:', error);
      return {
        emotion: 'error',
        score: 0,
        confidence: 0,
        source: 'error',
        timestamp: new Date().toISOString()
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const processAudio = async (audioUrl: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    try {
      // For demo purposes, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emotions = ['calm', 'excited', 'stressed', 'sad', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = Math.random() * 0.4 + 0.6; // Between 0.6 and 1.0
      
      const result = {
        id: `audio-${Date.now()}`,
        emotion: randomEmotion,
        dominantEmotion: randomEmotion,
        score: Math.round(confidence * 100),
        confidence: confidence,
        source: 'audio',
        timestamp: new Date().toISOString(),
        anxiety: Math.floor(Math.random() * 70) + 30,
        recommendations: [
          "Écoutez attentivement votre propre ton de voix",
          "Pratiquez des exercices de respiration pour moduler votre voix"
        ],
        feedback: `Votre voix exprime principalement l'émotion: ${randomEmotion}`
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error processing audio:', error);
      return {
        emotion: 'error',
        score: 0,
        confidence: 0,
        source: 'error',
        timestamp: new Date().toISOString()
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const processEmojis = async (emojis: string): Promise<EmotionResult> => {
    setIsProcessing(true);
    try {
      // Map common emojis to emotions
      const emojiToEmotion: Record<string, string> = {
        '😊': 'happy',
        '😀': 'happy',
        '😄': 'joy',
        '😃': 'joy',
        '🙂': 'content',
        '😐': 'neutral',
        '😕': 'confused',
        '😢': 'sad',
        '😭': 'sad',
        '😠': 'angry',
        '😡': 'angry',
        '😱': 'fear',
        '😨': 'fear',
        '😲': 'surprised',
        '😯': 'surprised',
        '🥰': 'love',
        '😍': 'love',
      };
      
      // For demo purposes, find the first emoji that matches
      let detectedEmotion = 'neutral';
      let confidence = 0.5;
      
      for (const emoji of emojis.split('')) {
        if (emojiToEmotion[emoji]) {
          detectedEmotion = emojiToEmotion[emoji];
          confidence = 0.8;
          break;
        }
      }
      
      // Wait for some time to simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const result = {
        id: `emoji-${Date.now()}`,
        emotion: detectedEmotion,
        dominantEmotion: detectedEmotion,
        score: Math.round(confidence * 100),
        confidence: confidence,
        source: 'emoji',
        timestamp: new Date().toISOString()
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error processing emojis:', error);
      return {
        emotion: 'neutral',
        score: 50,
        confidence: 0.5,
        timestamp: new Date().toISOString()
      };
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
