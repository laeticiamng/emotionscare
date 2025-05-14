
import { Emotion } from '@/types';

// Mock database
const emotionEntries: Record<string, Emotion[]> = {};

export const createEmotionEntry = async (data: {
  user_id: string;
  date: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<Emotion> => {
  // Create a new emotion entry
  const newEntry: Emotion = {
    id: `emotion-${Date.now()}`,
    user_id: data.user_id,
    date: data.date,
    text: data.text || '',
    emojis: data.emojis || '',
    sentiment: Math.random() * 10, // Mock sentiment score
    anxiety: Math.round(Math.random() * 10),
    energy: Math.round(Math.random() * 10),
    // Include optional fields if provided
    audio_url: data.audio_url,
    is_confidential: data.is_confidential,
    share_with_coach: data.share_with_coach
  };

  // Add to mock database
  if (!emotionEntries[data.user_id]) {
    emotionEntries[data.user_id] = [];
  }
  emotionEntries[data.user_id].push(newEntry);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return newEntry;
};

export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // Check if user has any emotions
  if (!emotionEntries[userId] || emotionEntries[userId].length === 0) {
    return null;
  }

  // Return latest emotion
  const entries = emotionEntries[userId];
  return entries[entries.length - 1];
};

export const fetchEmotions = async (userId: string): Promise<Emotion[]> => {
  // Return all emotions for a user
  return emotionEntries[userId] || [];
};
