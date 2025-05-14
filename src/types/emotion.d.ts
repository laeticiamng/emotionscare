
export interface EmotionalTeamViewProps {
  teamId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface EmotionResult {
  id: string;
  user_id: string;
  text?: string;
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: number;
  score: number;
  timestamp: string;
  ai_feedback?: string;
  feedback?: string;
  source?: string;
}

export interface Emotion {
  id: string;
  user_id: string;
  emojis: string;
  text?: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
  is_confidential: boolean;
  share_with_coach: boolean;
  audio_url?: string;
}
