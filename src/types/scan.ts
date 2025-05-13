
export interface ScanResult {
  id: string;
  user_id: string;
  timestamp: Date | string;
  emotion_data: EmotionScanData;
  confidence_score: number;
}

export interface EmotionScanData {
  primary_emotion: string;
  intensity: number;
  secondary_emotions?: string[];
  triggers?: string[];
  streak_days?: number;
  points_earned?: number;
}

export interface EmotionGamificationStats {
  total_scans: number;
  streak_days: number;
  points: number;
  level: number;
  next_milestone: number;
  badges_earned: string[];
  highest_emotion: string;
  emotional_balance: number; // 0-100 score of emotional health balance
}
