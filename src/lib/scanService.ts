
import { EmotionResult } from '@/types/types';
import { v4 as uuid } from 'uuid';

// Mock function for demo purposes - would connect to backend API
export async function analyzeEmotion(text: string, emojis?: string): Promise<EmotionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock analysis - in a real app this would call an API
  const emotions = ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuid(),
    emotion,
    score: Math.floor(Math.random() * 100),
    confidence: Math.random() * 0.9 + 0.1,
    intensity: Math.floor(Math.random() * 100),
    text,
    transcript: text,
    emojis: emojis?.split('') || [],
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    ai_feedback: `I detect a ${emotion} mood in your expression.`,
    feedback: `Your ${emotion} mood suggests...`,
    recommendations: [
      'Take a moment to breathe deeply',
      'Consider journaling about your feelings',
      'Listen to music that matches your mood'
    ]
  };
}

export async function saveEmotion(emotion: EmotionResult): Promise<boolean> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log('Saving emotion:', emotion);
  return true; // In a real app, return success/failure based on API response
}

export async function fetchEmotionHistory(userId: string, limit = 10): Promise<EmotionResult[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock history
  return Array(limit).fill(null).map((_, i) => ({
    id: uuid(),
    user_id: userId,
    emotion: ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'][Math.floor(Math.random() * 6)],
    score: Math.floor(Math.random() * 100),
    confidence: Math.random() * 0.9 + 0.1,
    intensity: Math.floor(Math.random() * 100),
    date: new Date(Date.now() - i * 86400000).toISOString(),
    timestamp: new Date(Date.now() - i * 86400000).toISOString(),
    text: 'Historical emotion entry',
    ai_feedback: 'Historical feedback'
  }));
}

export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  // Simulate processing audio
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const emotions = ['happy', 'sad', 'neutral', 'calm', 'anxious', 'excited'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuid(),
    emotion,
    score: Math.floor(Math.random() * 100),
    confidence: Math.random() * 0.9 + 0.1,
    intensity: Math.floor(Math.random() * 100),
    transcript: "This is a simulated transcript from audio analysis",
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    audio_url: URL.createObjectURL(audioBlob),
    audioUrl: URL.createObjectURL(audioBlob),
    ai_feedback: `The audio analysis indicates a ${emotion} emotional state.`
  };
}
