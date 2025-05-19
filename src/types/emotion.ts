// This file would contain the types related to emotions
export interface Emotion {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source?: string;
  // Add other properties as needed
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  source: string;
  timestamp: string;
  recommendations?: (string | EmotionRecommendation)[];
  feedback?: string;
  ai_feedback?: string;
  emojis?: string[];
  emotions?: Record<string, number>;
  // Additional optional fields for compatibility
  textInput?: string;
  audioUrl?: string;
  facialExpression?: string;
  text?: string;
  transcript?: string;
}

export interface EmotionRecommendation {
  id?: string;
  title: string;
  description?: string;
  type?: string;
  category?: string;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export type EmotionHistory = EmotionResult[];
