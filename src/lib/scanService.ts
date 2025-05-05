
// Update or create the scanService.ts to include the proper function signatures

import { Emotion } from '@/types';
import { analyzeEmotion as analyzeEmotionService, analyzeAudioStream as analyzeAudioStreamService, saveRealtimeEmotionScan as saveRealtimeEmotionScanService } from '@/lib/scan/analyzeService';
import { createEmotionEntry as createEmotionEntryService, fetchLatestEmotion as fetchLatestEmotionService, fetchEmotionHistory as fetchEmotionHistoryService } from '@/lib/scan/emotionService';

// Export the EmotionResult type so it can be imported elsewhere
export interface EmotionResult {
  emotion?: string;
  confidence?: number;
  transcript?: string;
  id?: string;
  user_id?: string;
  date?: string;
  intensity?: number;
  score?: number;
}

// Function to analyze audio stream
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  try {
    return await analyzeAudioStreamService([new Uint8Array(await audioBlob.arrayBuffer())]);
  } catch (error) {
    console.error('Error analyzing audio stream:', error);
    return {
      emotion: 'neutral',
      confidence: 0.5,
      transcript: 'Erreur d\'analyse'
    };
  }
};

// Function to save realtime emotion scan
export const saveRealtimeEmotionScan = async (emotion: Emotion, userId: string): Promise<void> => {
  try {
    await saveRealtimeEmotionScanService(emotion, userId);
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
    return await analyzeEmotionService(payload);
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
};

export const fetchEmotionHistory = async (userId?: string): Promise<Emotion[]> => {
  try {
    return await fetchEmotionHistoryService();
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
    return await createEmotionEntryService(data);
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
};

export const fetchLatestEmotion = async (userId?: string): Promise<Emotion | null> => {
  try {
    return await fetchLatestEmotionService();
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    return null;
  }
};
