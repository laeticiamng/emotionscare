
export interface EmotionResult {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  confidence: number;
  intensity?: number;
  text?: string;
  feedback?: string;
  transcript?: string;
  timestamp?: string | Date;
}

export interface EmotionScanResult {
  emotion: string;
  score: number;
  confidence?: number;
  intensity?: number;
  feedback?: string;
}

export interface EmotionFeedbackProps {
  result: EmotionResult;
  onSaveFeedback?: (feedback: string) => void;
}

export interface EmotionHistoryProps {
  userId?: string;
  limit?: number;
  showDetails?: boolean;
}
