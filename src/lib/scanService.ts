
import { v4 as uuidv4 } from 'uuid';
import { Emotion, EmotionResult } from '@/types';
import { analyzeEmotion as analyzeTextEmotion, analyzeAudioEmotion } from '@/lib/scan/analyzeService';
import { analyzeEmotionEnhanced, analyzeAudioEmotionEnhanced } from '@/lib/scan/enhancedAnalyzeService';

// Mock database
const emotionsDb: Emotion[] = [];

// Analyze text emotion
export async function analyzeEmotion(params: any): Promise<EmotionResult> {
  if (typeof params === 'string') {
    // Handle it as simple text input
    return analyzeTextEmotion(params);
  }

  // Handle it as complex input object
  const { text, emojis, audio_url, user_id } = params;
  
  // Prioritize text analysis, fallback to emoji analysis
  if (text) {
    return analyzeTextEmotion(text);
  } else if (emojis) {
    return analyzeTextEmotion(`Feeling ${emojis}`);
  } else if (audio_url) {
    // This is a mock, in a real app we would use the audio URL
    return analyzeAudioEmotion(new Blob());
  }
  
  // Default neutral emotion if no input
  return {
    emotion: 'neutral',
    confidence: 0.5,
    score: 50,
    transcript: '',
    feedback: 'Not enough information provided to analyze emotion.',
    recommendations: ['Try providing some text or audio to analyze your emotion.']
  };
}

// Get emotions list
export async function getEmotionHistory(): Promise<Emotion[]> {
  // This would typically be fetched from a database
  return generateMockEmotions(10);
}

// Get emotions for a specific user
export async function getEmotions(userId?: string): Promise<Emotion[]> {
  if (userId) {
    return generateMockEmotions(5, userId);
  }
  return generateMockEmotions(10);
}

// Create a new emotion entry
export async function createEmotionEntry(data: any): Promise<Emotion> {
  const emotion: Emotion = {
    id: uuidv4(),
    user_id: data.user_id || 'anonymous',
    date: new Date().toISOString(),
    emotion: data.emotion || 'neutral',
    score: data.score || 50,
    text: data.text || '',
    emojis: data.emojis || '',
    audio_url: data.audio_url || null,
    confidence: data.confidence || 0.5,
    ai_feedback: data.ai_feedback || 'No feedback available.'
  };
  
  emotionsDb.push(emotion);
  return emotion;
}

// Get latest emotion for a user
export async function fetchLatestEmotion(userId: string): Promise<Emotion | null> {
  return generateMockEmotions(1, userId)[0] || null;
}

// Process audio stream
export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  // In a real application, this would send the audio to a backend service
  return analyzeAudioEmotion(audioBlob);
}

// Save a realtime emotion scan
export async function saveRealtimeEmotionScan(result: EmotionResult): Promise<EmotionResult> {
  // Create an emotion entry from the result
  createEmotionEntry({
    user_id: result.user_id || 'anonymous',
    emotion: result.emotion,
    score: result.score,
    text: result.transcript || '',
    confidence: result.confidence,
    ai_feedback: result.feedback
  });
  
  return result;
}

// Helper function to generate mock emotions
function generateMockEmotions(count: number, userId?: string): Emotion[] {
  const emotions: Emotion[] = [];
  const types = ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    emotions.push({
      id: uuidv4(),
      user_id: userId || `user-${Math.floor(Math.random() * 5) + 1}`,
      date: date.toISOString(),
      emotion: type,
      dominant_emotion: type,
      score: Math.floor(Math.random() * 100),
      confidence: Math.random(),
      text: `This is a sample ${type} emotion entry.`,
      emojis: i % 2 === 0 ? '😀' : '😔',
      ai_feedback: `AI feedback for ${type} emotion.`
    });
  }
  
  return emotions;
}

export default {
  analyzeEmotion,
  getEmotions,
  getEmotionHistory,
  createEmotionEntry,
  fetchLatestEmotion,
  analyzeAudioStream,
  saveRealtimeEmotionScan
};
