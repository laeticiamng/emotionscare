export interface EmotionResult {
  emotion: string;
  confidence: number;
  valence: number;
  arousal: number;
  timestamp: Date;
  insight?: string;
  intensity?: number;
  suggestions?: string[];
  source?: 'text' | 'voice' | 'facial' | 'manual';
  transcription?: string;
  sentiment?: string;
  details?: any;
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

export interface EmotionalTeamViewProps {
  teamId?: string;
  data?: any[];
  period?: 'day' | 'week' | 'month' | 'year';
  anonymized?: boolean;
  dateRange?: { start: Date; end: Date };
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
  showDetails?: boolean;
}