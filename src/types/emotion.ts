export interface EmotionResult {
  emotion: string;
  confidence: number;
  valence: number;
  arousal: number;
  timestamp: Date;
  insight?: string;
  intensity?: number;
  suggestions?: string[];
}

export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  duration?: string;
  action?: string;
}

export interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  isActive?: boolean;
  scanDuration?: number;
}

export interface EmotionAnalysis {
  dominantEmotion: string;
  confidence: number;
  valence: number;
  arousal: number;
  overallMood: string;
  recommendations: EmotionRecommendation[];
}