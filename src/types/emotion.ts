
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion?: string;
  name?: string;  // Added for compatibility
  score?: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  sentiment?: number; // Added for compatibility with mockEmotions
  category?: string; // Added for compatibility
  intensity?: number; // Adding for MusicRecommendation component
  confidence?: number; // Adding for EmotionScanForm
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion: string;
  dominantEmotion?: string;  // Adding for compatibility
  primaryEmotion?: string;   // Some components expect this property
  score: number;
  text?: string;
  transcript?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  source?: "audio" | "text" | "camera" | "manual" | "voice";
  date?: string;
  timestamp?: string;
  confidence?: number;
  intensity?: number;
  recommendations?: string[];
}

export type EmotionType = {
  name: string;
  color: string;
  icon?: string;
  description?: string;
  category?: "positive" | "negative" | "neutral" | "other";
}

export interface EnhancedEmotionResult extends EmotionResult {
  category?: "positive" | "negative" | "neutral" | "other";
  trend?: "increasing" | "decreasing" | "stable";
  previousScore?: number;
  changePercentage?: number;
  triggers?: string[];
  recommendations?: string[];
}

export interface EmotionalTeamViewProps {
  teamId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  className?: string;
  userId?: string;
  period?: string;
  onRefresh?: () => void;
}
