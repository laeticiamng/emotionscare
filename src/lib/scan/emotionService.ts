
import { Emotion } from '@/types';

// Mock function to simulate inserting an emotion
export const insertEmotion = async (emotion: Partial<Emotion>): Promise<Emotion | null> => {
  try {
    // Convert Date to string if it's a Date object
    const emotionData = {
      ...emotion,
      date: emotion.date instanceof Date ? emotion.date.toISOString() : emotion.date,
    };
    
    // Here you would typically insert into a database
    // For now, just return the input with generated ID
    return {
      id: `emotion-${Date.now()}`,
      ...emotionData,
    } as Emotion;
  } catch (error) {
    console.error("Error inserting emotion:", error);
    return null;
  }
};

// Alias for insertEmotion to match the imported name in scanService
export const createEmotionEntry = insertEmotion;

// Mock function to simulate fetching the latest emotion for a user
export const getLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // Simulate fetching from a database
  // Replace this with your actual data fetching logic
  
  // For now, return a mock emotion
  return {
    id: 'latest-emotion-123',
    user_id: userId,
    date: new Date(),
    score: 75,
    emotion: 'happy',
    text: 'Feeling good today!',
    emojis: '😊',
    ai_feedback: 'Keep up the positive vibes!',
    source: 'mock'
  } as Emotion;
};

// Alias for getLatestEmotion to match the imported name in scanService
export const fetchLatestEmotion = getLatestEmotion;

// Mock function to simulate fetching emotion history for a user
export const getEmotionHistory = async (userId: string): Promise<Emotion[]> => {
  // Simulate fetching from a database
  // Replace this with your actual data fetching logic
  
  // For now, return an array of mock emotions
  return [
    {
      id: 'emotion-1',
      user_id: userId,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      score: 60,
      emotion: 'neutral',
      text: 'Just another day',
      emojis: '😐',
      ai_feedback: 'Try to find something interesting today!',
      source: 'mock'
    },
    {
      id: 'emotion-2',
      user_id: userId,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      score: 80,
      emotion: 'happy',
      text: 'Had a great workout!',
      emojis: '💪😊',
      ai_feedback: 'Great job on staying active!',
      source: 'mock'
    }
  ] as Emotion[];
};

// Alias for getEmotionHistory to match the imported name in scanService
export const fetchEmotionHistory = getEmotionHistory;
