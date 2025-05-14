
export interface Emotion {
  id?: string;
  name?: string;
  intensity?: number;
  date?: string | Date;
  notes?: string;
  color?: string;
  anxiety?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
  sentiment?: number;
  trigger?: string;
  context?: string;
  
  // Additional properties needed for components
  emotion?: string;
  score?: number;
  confidence?: number;
  text?: string;
  ai_feedback?: string;
  recommendations?: string[];
  timestamp?: string;
  feedback?: string;
  emojis?: string[];
  audio_url?: string;
  category?: string;
  transcript?: string;
}

export interface EmotionResult {
  id?: string;
  emotion?: string;
  dominantEmotion?: string;
  primaryEmotion?: string;
  score?: number;
  confidence?: number;
  source?: string;
  text?: string;
  emojis?: string[];
  timestamp?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  user_id?: string;
  date?: string;
  intensity?: number;
  transcript?: string;
  category?: string;
  audio_url?: string; // Added for VoiceEmotionScanner
}
