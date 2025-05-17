
import { EmotionResult } from './emotion';

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
}

export { EmotionResult };
export type { TeamOverviewProps } from './emotion';
