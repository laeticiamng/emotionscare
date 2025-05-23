
export interface EmotionResult {
  id: string;
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  score: number;
  date: string;
  ai_feedback?: string;
}

export interface EmotionAnalysis {
  score: number;
  feedback: string;
  emotions: string[];
  confidence?: number;
}

export interface VoiceAnalysisResult {
  transcription: string;
  analysis: EmotionAnalysis;
}
