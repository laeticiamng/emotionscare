
import { EmotionResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mocked function for analyzing audio stream
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock emotion analysis
  return {
    id: uuidv4(),
    emotion: ['happy', 'sad', 'neutral', 'anxious', 'calm'][Math.floor(Math.random() * 5)],
    confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
    score: Math.floor(Math.random() * 100),
    transcript: "This is a simulated transcript from audio analysis.",
    feedback: "Here is some AI feedback about your emotional state.",
    recommendations: [
      "Take a short break",
      "Practice deep breathing",
      "Listen to calming music"
    ],
  };
};

// Function to save emotion scan results
export const saveRealtimeEmotionScan = async (emotionData: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: uuidv4(),
    user_id: emotionData.user_id || 'anonymous',
    date: new Date().toISOString(),
    emotion: emotionData.emotion || 'neutral',
    confidence: emotionData.confidence || 0.75,
    score: emotionData.score || 50,
    transcript: emotionData.transcript,
    text: emotionData.text,
    feedback: emotionData.feedback,
  };
};

// Function to analyze text or emojis for emotion
export const analyzeEmotion = async (input: { 
  text?: string; 
  emojis?: string; 
  userId?: string;
}): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: uuidv4(),
    user_id: input.userId,
    date: new Date().toISOString(),
    emotion: ['happy', 'sad', 'neutral', 'anxious', 'calm'][Math.floor(Math.random() * 5)],
    confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
    score: Math.floor(Math.random() * 100),
    text: input.text,
    emojis: input.emojis?.split('') || [],
    feedback: "Here is some AI feedback based on your input.",
  };
};
