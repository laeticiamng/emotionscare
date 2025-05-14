
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types';

// Analyze emotion from text input
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  return {
    id: uuid(),
    date: new Date().toISOString(),
    emotion: 'calm',
    score: 0.75,
    confidence: 0.75,
    text: text,
    recommendations: ['Take a short break', 'Practice deep breathing']
  };
};

// Save emotion result to database
export const saveEmotion = async (emotion: EmotionResult): Promise<void> => {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log('Emotion saved:', emotion);
};

// Create emotion entry
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Ensure required fields
  const emotion: EmotionResult = {
    id: data.id || uuid(),
    date: data.date || new Date().toISOString(),
    emotion: data.emotion || 'neutral',
    score: data.score || 0.5,
    confidence: data.confidence || 0.5,
    text: data.text || '',
    user_id: data.user_id
  };
  
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return emotion;
};

// Fetch latest emotion for a user
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock data
  return {
    id: uuid(),
    date: new Date().toISOString(),
    emotion: 'content',
    score: 0.82,
    confidence: 0.85,
    text: "I'm feeling quite good today",
    user_id: userId
  };
};

// Analyze emotion from audio stream
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock result
  return {
    id: uuid(),
    date: new Date().toISOString(),
    emotion: 'calm',
    score: 0.7,
    confidence: 0.68,
    transcript: "I feel relaxed and at ease today.",
    audio_url: URL.createObjectURL(audioBlob)
  };
};
