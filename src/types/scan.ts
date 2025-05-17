
export interface EmotionScan {
  id: string;
  userId: string;
  timestamp: string;
  primaryEmotion: string;
  score: number;
  emotions: Record<string, number>;
  audioUrl?: string;
  transcription?: string;
}

export interface EmotionGamificationStats {
  total_scans: number;
  streak_days: number;
  points: number;
  level: number;
  next_milestone: number;
  badges_earned: string[];
  highest_emotion: string;
  emotional_balance: number;
}

export interface ScanHistoryEntry {
  id: string;
  date: string;
  emotion: string;
  score: number;
}

export interface EmotionSnapshot {
  emotion: string;
  percentage: number;
  color: string;
}

export interface EmotionTrend {
  date: string;
  joy?: number;
  sadness?: number;
  anger?: number;
  fear?: number;
  disgust?: number;
  surprise?: number;
  [key: string]: string | number | undefined;
}

export interface EmotionResult {
  id: string;
  userId?: string;
  user_id?: string;
  timestamp?: string;
  date?: string;
  emotion?: string;
  primary_emotion?: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  emojis?: string | string[];
  text?: string;
  transcript?: string;
  audio_url?: string;
  audioUrl?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: any;
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}
