
import { Emotion, EmotionResult } from '@/types';
import { 
  analyzeEmotion as analyzeEmotionService, 
  analyzeEmotions as analyzeEmotionsService, 
  analyzeAudioStream as analyzeAudioStreamService, 
  saveRealtimeEmotionScan as saveRealtimeEmotionScanService 
} from '@/lib/scan/analyzeService';
import { createEmotionEntry as createEmotionEntryService, fetchLatestEmotion as fetchLatestEmotionService, fetchEmotionHistory as fetchEmotionHistoryService } from '@/lib/scan/emotionService';

// Re-export the EmotionResult type for components to use
export type { EmotionResult } from '@/types';

// Function to analyze audio stream
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  try {
    // Convert Blob to Uint8Array for the service function
    const arrayBuffer = await audioBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    return await analyzeAudioStreamService([uint8Array]);
  } catch (error) {
    console.error('Error analyzing audio stream:', error);
    return {
      emotion: 'neutral', // Provide a default value for the required field
      confidence: 0.5,
      transcript: 'Erreur d\'analyse',
      feedback: 'Une erreur est survenue lors de l\'analyse'
    };
  }
};

// Function to save realtime emotion scan
export const saveRealtimeEmotionScan = async (emotion: Emotion, userId: string): Promise<void> => {
  try {
    if (!userId) {
      throw new Error("user_id is required for saving realtime emotion scan");
    }
    
    // Make sure emotion has all required properties
    const emotionWithDefaults: EmotionResult = {
      emotion: emotion.emotion || 'neutral',
      confidence: emotion.confidence || 0.5,
      feedback: emotion.ai_feedback || '',
      transcript: emotion.text || ''
    };
    
    await saveRealtimeEmotionScanService(emotionWithDefaults, userId);
  } catch (error) {
    console.error('Error saving emotion scan:', error);
    throw error;
  }
};

// Add missing functions that are being imported elsewhere
export const analyzeEmotion = async (payload: {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string | null;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  try {
    // Verify required fields
    if (!payload.user_id) {
      throw new Error("user_id is required for emotion analysis");
    }
    
    return await analyzeEmotionService(payload);
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
};

export const fetchEmotionHistory = async (userId?: string): Promise<Emotion[]> => {
  try {
    return await fetchEmotionHistoryService(userId || '');
  } catch (error) {
    console.error('Error fetching emotion history:', error);
    return [];
  }
};

export const createEmotionEntry = async (data: {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
}): Promise<Emotion> => {
  try {
    // Verify required fields
    if (!data.user_id) {
      throw new Error("user_id is required for creating emotion entry");
    }
    
    const result = await createEmotionEntryService(data);
    if (!result) {
      throw new Error("Failed to create emotion entry");
    }
    return result;
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
};

export const fetchLatestEmotion = async (userId?: string): Promise<Emotion | null> => {
  try {
    return await fetchLatestEmotionService(userId || '');
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    return null;
  }
};
