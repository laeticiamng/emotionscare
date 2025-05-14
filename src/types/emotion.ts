
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
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  dominantEmotion?: string;  // Adding for compatibility
  score: number;
  text?: string;
  transcript?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  source?: "audio" | "text" | "camera" | "manual" | "voice";
}

export type EmotionType = "neutral" | "positive" | "negative" | "other";
