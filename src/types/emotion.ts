
// Emotion related types

export interface Emotion {
  id: string;
  user_id: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  created_at: string;
  intensity?: number;
  feedback?: string;
  tags?: string[];
  notes?: string;
  emojis?: string;
  valence?: number;
  arousal?: number;
  is_acknowledged?: boolean;
  related_activity?: string;
  metadata?: Record<string, any>;
  context?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  transcript?: string;
  intensity?: number;
  emojis?: string;
  valence?: number;
  arousal?: number;
  timestamp?: string;
  id?: string;
  metadata?: Record<string, any>;
}

export interface EmotionFeedbackData {
  id: string;
  user_id: string;
  emotion_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  accuracy?: number;
  usefulness?: number;
  tags?: string[];
  is_public?: boolean;
}

export interface EmotionStatistics {
  total_scans: number;
  average_intensity: number;
  most_frequent: string;
  trends: Array<{
    date: string;
    count: number;
    emotions: Record<string, number>;
  }>;
  recent_change_percent?: number;
  comparison_period?: string;
}
