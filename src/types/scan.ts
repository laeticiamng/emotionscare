
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
  points: number;
  next_milestone: number;
  emotional_balance: number;
  badges_earned: string[];
  total_scans: number;
  streak_days: number;
  highest_emotion?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month' | string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: Array<{
    id: string;
    name: string;
    emotionalScore?: number | Record<string, number>;
    [key: string]: any;
  }>;
  showNames?: boolean;
  compact?: boolean;
}

export { EmotionResult };
