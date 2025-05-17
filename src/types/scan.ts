
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
