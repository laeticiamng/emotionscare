// @ts-nocheck

import { EmotionResult } from './emotion';

export interface EmotionScanFormProps {
  userId?: string;
  onEmotionDetected?: (result: EmotionResult) => void;
  onClose?: () => void;
  onScanComplete?: (result: EmotionResult) => void;
  onComplete?: (result: EmotionResult) => void;
  defaultTab?: string;
  onProcessingChange?: (processing: boolean) => void;
  onSave?: () => void;
  onSaveFeedback?: (feedback: string) => void;
  onScanSaved?: () => void;
}

export type ScanType = 'text' | 'facial' | 'audio' | 'manual' | 'voice' | 'emoji';

export interface ScanResult {
  id: string;
  timestamp: string;
  type: ScanType;
  emotions: EmotionResult;
  userId?: string;
  notes?: string;
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  source: ScanType;
}

export interface EmotionGamificationStats {
  totalScans: number;
  streakDays: number;
  emotionDiversity: number;
  topEmotion: string;
  positiveRatio: number;
  achievements: string[];
  progress: number;
  level: number;
  points: number;
  next_milestone: number;
  emotional_balance: number;
  badges_earned: string[];
  total_scans: number;
  streak_days: number;
  highest_emotion?: string;
}

// Define the MoodData interface that was missing from emotion.ts
export interface MoodData {
  emotion: string;
  intensity: number;
  timestamp: string;
  date?: string;
  userId?: string;
  source?: string;
  tags?: string[];
}

// Add EmotionPrediction interface that was missing
export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers?: string[];
  recommendations?: string[];
}

// Add EnhancedEmotionResult interface
export interface EnhancedEmotionResult extends EmotionResult {
  emotions: Record<string, number>;
  dominantEmotionObj?: {
    name: string;
    score: number;
  };
}

export { EmotionResult };
