
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
  // These properties added for consistent use in components
  score?: number;
  text?: string;
  date?: string;
  ai_feedback?: string;
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
  // These properties added for consistent use in components
  score?: number;
  feedback?: string;
  ai_feedback?: string;
  text?: string;
  recommendations?: string[];
  user_id?: string;
  date?: string;
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

export interface EnhancedEmotionResult {
  emotion: string;
  confidence: number;
  feedback: string;
  recommendations: string[];
  transcript?: string;
  intensity?: number;
  valence?: number;
  arousal?: number;
}
