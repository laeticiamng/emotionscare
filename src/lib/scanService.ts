
import { createEmotionEntry, fetchLatestEmotion } from './scan/emotionService';
import { analyzeEmotion, analyzeAudioStream, saveRealtimeEmotionScan } from './scan/analyzeService';
import { fetchEmotionHistory } from './scan/emotionService';
import type { Emotion } from '@/types';

// Re-export all functions from the scan directory
export {
  createEmotionEntry,
  fetchLatestEmotion,
  analyzeEmotion,
  analyzeAudioStream,
  saveRealtimeEmotionScan,
  fetchEmotionHistory,
};

// Re-export EmotionResult type
export type EmotionResult = {
  emotion?: string;
  emotionName?: string;
  confidence: number;
  transcript?: string;
  emotions?: Record<string, number>;
};
