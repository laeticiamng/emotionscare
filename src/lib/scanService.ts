
import { EmotionResult } from "@/types";

export async function createEmotionEntry(data: any): Promise<EmotionResult> {
  console.log('Creating emotion entry with data:', data);
  
  // Mock implementation
  return {
    id: `emotion-${Date.now()}`,
    emotion: data.emotion || 'neutral',
    score: data.score || 50,
    confidence: data.confidence || 0.8,
    date: new Date().toISOString(),
    text: data.text || '',
    user_id: data.user_id
  };
}

export async function fetchLatestEmotion(userId: string): Promise<EmotionResult | null> {
  console.log('Fetching latest emotion for user:', userId);
  
  // Mock implementation
  return {
    id: `emotion-${Date.now() - 100000}`,
    emotion: 'calm',
    score: 78,
    confidence: 0.9,
    date: new Date().toISOString(),
    user_id: userId
  };
}

export async function analyzeEmotion(text: string): Promise<EmotionResult> {
  console.log('Analyzing emotion from text:', text);
  
  // Mock implementation
  return {
    id: `emotion-${Date.now()}`,
    emotion: 'happy',
    score: 85,
    confidence: 0.92,
    text: text,
    date: new Date().toISOString()
  };
}

export async function saveEmotion(data: Partial<EmotionResult>): Promise<EmotionResult> {
  console.log('Saving emotion:', data);
  
  // Mock implementation
  return {
    id: data.id || `emotion-${Date.now()}`,
    emotion: data.emotion || 'neutral',
    score: data.score || 50,
    confidence: data.confidence || 0.8,
    date: new Date().toISOString(),
    text: data.text || '',
    user_id: data.user_id
  };
}

export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  console.log('Analyzing audio stream');
  
  // Mock implementation
  return {
    id: `emotion-${Date.now()}`,
    emotion: 'calm',
    score: 72,
    confidence: 0.85,
    date: new Date().toISOString(),
    audio_url: URL.createObjectURL(audioBlob)
  };
}
