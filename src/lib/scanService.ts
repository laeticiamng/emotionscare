
import { EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export async function analyzeEmotion(text: string): Promise<EmotionResult> {
  try {
    // Simulate API call for now
    return {
      id: crypto.randomUUID(),
      emotion: 'neutral',
      score: 0.75,
      confidence: 0.8,
      date: new Date().toISOString(),
      text: text
    };
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
}

export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  try {
    // Simulate API call for now
    return {
      id: crypto.randomUUID(),
      emotion: 'neutral',
      score: 0.65,
      confidence: 0.7,
      date: new Date().toISOString(),
      audio_url: URL.createObjectURL(audioBlob)
    };
  } catch (error) {
    console.error('Error analyzing audio stream:', error);
    throw error;
  }
}

export async function createEmotionEntry(userId: string, data: Partial<EmotionResult>): Promise<EmotionResult> {
  try {
    // Set default values
    const emotionEntry: Partial<EmotionResult> = {
      ...data,
      id: data.id || crypto.randomUUID(),
      user_id: userId,
      date: data.date || new Date().toISOString(),
    };

    // Use this for mock purposes
    return emotionEntry as EmotionResult;
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
}

export async function saveEmotion(userId: string, emotion: EmotionResult): Promise<EmotionResult> {
  try {
    if (!userId) {
      throw new Error('User ID is required to save emotion');
    }

    // For now just return the emotion as if it was saved
    return {
      ...emotion,
      user_id: userId,
      id: emotion.id || crypto.randomUUID(),
      date: emotion.date || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error saving emotion:', error);
    throw error;
  }
}

export async function getEmotionalHistory(userId: string, limit = 10): Promise<EmotionResult[]> {
  try {
    // Simulate fetching from database
    return Array(limit).fill(null).map((_, i) => ({
      id: `emotion-${i}`,
      user_id: userId,
      emotion: ['joy', 'sadness', 'anger', 'fear', 'neutral'][Math.floor(Math.random() * 5)],
      score: Math.random(),
      confidence: Math.random(),
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      text: `Emotion entry ${i}`
    }));
  } catch (error) {
    console.error('Error fetching emotional history:', error);
    return [];
  }
}
