
import { Emotion } from '@/types';
import { mockEmotions } from '@/data/mockEmotions';

// Fix the missing functions that were being imported
export async function createEmotionEntry(data: { 
  user_id: string; 
  text?: string;
  emojis?: string;
  audio_url?: string; 
}): Promise<Emotion> {
  // Create a mock emotion entry based on the provided data
  const newEmotion: Emotion = {
    id: `temp-${Date.now()}`,
    user_id: data.user_id,
    emotion: data.text ? 'neutral' : 'happy', // Default or based on text analysis
    confidence: 0.8,
    date: new Date().toISOString(),
    text: data.text,
    score: 75,
    emojis: data.emojis ? [data.emojis] : ['😊'],
    ai_feedback: "Merci pour votre contribution. Votre bien-être est important."
  };
  
  console.log('Created new emotion entry:', newEmotion);
  return newEmotion;
}

export async function fetchLatestEmotion(userId: string): Promise<Emotion | null> {
  // Get latest emotion from mock data
  const userEmotions = mockEmotions
    .filter(e => e.user_id === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return userEmotions[0] || null;
}

export async function fetchEmotionHistory(): Promise<Emotion[]> {
  // Return all mock emotions as history
  return Promise.resolve(mockEmotions);
}

// For backwards compatibility
export async function getLatestEmotion(userId: string): Promise<Emotion | null> {
  return fetchLatestEmotion(userId);
}

export async function getEmotionHistory(): Promise<Emotion[]> {
  return fetchEmotionHistory();
}
