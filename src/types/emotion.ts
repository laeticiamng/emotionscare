
export interface EmotionResult {
  emotion: string;
  intensity: number;
  source: 'text' | 'facial' | 'voice' | 'emoji';
  score?: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  image_url?: string;
  ai_feedback?: string;
  date?: string;
}
