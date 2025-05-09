
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

// Add the missing functions
export const fetchEmotionHistory = async (userId?: string): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return Array(5).fill(0).map((_, i) => ({
    id: uuidv4(),
    user_id: userId || 'anonymous',
    date: new Date(Date.now() - i * 86400000).toISOString(), // One day ago * i
    emotion: ['happy', 'sad', 'neutral', 'anxious', 'calm'][Math.floor(Math.random() * 5)],
    confidence: Math.random() * 0.5 + 0.5,
    score: Math.floor(Math.random() * 100),
    text: i % 2 === 0 ? "Sample text entry for emotion tracking" : undefined,
    ai_feedback: i % 3 === 0 ? "AI feedback based on your emotional pattern" : undefined
  }));
};

export const getEmotions = async (userId?: string): Promise<any[]> => {
  return fetchEmotionHistory(userId);
};

export const createEmotionEntry = async (input: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
}): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: uuidv4(),
    user_id: input.user_id,
    date: new Date().toISOString(),
    emotion: ['happy', 'sad', 'neutral', 'anxious', 'calm'][Math.floor(Math.random() * 5)],
    confidence: Math.random() * 0.5 + 0.5,
    score: Math.floor(Math.random() * 100),
    text: input.text,
    ai_feedback: "AI feedback on your emotional state"
  };
};

export const fetchLatestEmotion = async (userId: string): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: uuidv4(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: ['happy', 'sad', 'neutral', 'anxious', 'calm'][Math.floor(Math.random() * 5)],
    confidence: Math.random() * 0.5 + 0.5,
    score: Math.floor(Math.random() * 100)
  };
};
