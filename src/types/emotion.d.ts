
// Define the structure of an emotion result
export interface EmotionResult {
  id: string;
  emotion: string;
  primaryEmotion?: string;
  confidence: number;
  intensity: number;
  timestamp: string;
  recommendations: EmotionRecommendation[];
  text?: string;
  audioUrl?: string;
  transcript?: string;
  source: string;
  emotions?: Record<string, number>;
  emojis?: string[];
  feedback?: string;
}

export interface EmotionRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  actionUrl?: string;
  icon?: string;
}

export interface EmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  className?: string;
  autoSubmit?: boolean;
  initialPrompt?: string;
}
