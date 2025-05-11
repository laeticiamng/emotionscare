
import { v4 as uuidv4 } from 'uuid';
import { Emotion } from '@/types/emotion';

// Mock emotion data
const mockEmotions: Emotion[] = [];

/**
 * Get all emotions for a user
 * @param userId The user ID
 * @param limit Optional limit on the number of results
 */
export async function getEmotions(userId: string, limit?: number): Promise<Emotion[]> {
  const userEmotions = mockEmotions.filter(e => e.user_id === userId);
  
  // Sort by date, newest first
  const sortedEmotions = userEmotions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return limit ? sortedEmotions.slice(0, limit) : sortedEmotions;
}

/**
 * Get a specific emotion by ID
 * @param emotionId The emotion ID
 */
export async function getEmotionById(emotionId: string): Promise<Emotion | null> {
  const emotion = mockEmotions.find(e => e.id === emotionId);
  return emotion || null;
}

/**
 * Create a new emotion record
 * @param emotion The emotion data
 */
export async function createEmotion(emotion: Partial<Emotion>): Promise<Emotion> {
  const newEmotion: Emotion = {
    id: emotion.id || uuidv4(),
    user_id: emotion.user_id || '',
    date: emotion.date || new Date().toISOString(),
    emotion: emotion.emotion || 'neutral',
    score: emotion.score || 0.5,
    text: emotion.text,
    emojis: emotion.emojis,
    audio_url: emotion.audio_url,
    ai_feedback: emotion.ai_feedback,
    created_at: new Date().toISOString(),
    confidence: emotion.confidence,
    intensity: emotion.intensity,
    category: emotion.category,
    source: emotion.source,
    primaryEmotion: emotion.primaryEmotion || {
      name: emotion.emotion || 'neutral',
      intensity: emotion.intensity || 0.5,
      score: emotion.score || 0.5
    }
  };
  
  mockEmotions.push(newEmotion);
  return newEmotion;
}

/**
 * Get the latest emotion for a user
 * @param userId The user ID
 */
export async function getLatestEmotion(userId: string): Promise<Emotion | null> {
  const userEmotions = await getEmotions(userId, 1);
  return userEmotions.length > 0 ? userEmotions[0] : null;
}

/**
 * Create a positive emotion
 * @param userId The user ID
 * @param text Optional text
 */
export async function createPositiveEmotion(userId: string, text?: string): Promise<Emotion> {
  return createEmotion({
    user_id: userId,
    emotion: 'joy',
    score: 0.8,
    text,
    confidence: 0.9,
    intensity: 0.75,
    source: 'manual',
    primaryEmotion: {
      name: 'joy',
      intensity: 0.75,
      score: 0.8
    }
  });
}

/**
 * Create a negative emotion
 * @param userId The user ID
 * @param text Optional text
 */
export async function createNegativeEmotion(userId: string, text?: string): Promise<Emotion> {
  return createEmotion({
    user_id: userId,
    emotion: 'sadness',
    score: 0.3,
    text,
    confidence: 0.85,
    intensity: 0.6,
    source: 'manual',
    primaryEmotion: {
      name: 'sadness',
      intensity: 0.6,
      score: 0.3
    }
  });
}

/**
 * Create a neutral emotion
 * @param userId The user ID
 * @param text Optional text
 */
export async function createNeutralEmotion(userId: string, text?: string): Promise<Emotion> {
  return createEmotion({
    user_id: userId,
    emotion: 'neutral',
    score: 0.5,
    text,
    confidence: 0.7,
    intensity: 0.3,
    source: 'manual',
    primaryEmotion: {
      name: 'neutral',
      intensity: 0.3,
      score: 0.5
    }
  });
}

/**
 * Update an emotion
 * @param emotionId The emotion ID
 * @param updates The updates to apply
 */
export async function updateEmotion(emotionId: string, updates: Partial<Emotion>): Promise<Emotion | null> {
  const index = mockEmotions.findIndex(e => e.id === emotionId);
  
  if (index === -1) {
    return null;
  }
  
  mockEmotions[index] = {
    ...mockEmotions[index],
    ...updates,
    source: updates.source || mockEmotions[index].source
  };
  
  return mockEmotions[index];
}

export default {
  getEmotions,
  getEmotionById,
  createEmotion,
  getLatestEmotion,
  createPositiveEmotion,
  createNegativeEmotion,
  createNeutralEmotion,
  updateEmotion
};
