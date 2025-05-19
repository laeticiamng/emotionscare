
// Types liés aux émotions et analyses émotionnelles

export interface Emotion {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  intensity?: number;
  category?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  primaryEmotion?: string;
  intensity?: number;
  confidence?: number;
  timestamp: string;
  source: string;
  score?: number;
  text?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: EmotionRecommendation[];
  emojis?: string[] | string;
  tags?: string[];
}

export interface EmotionRecommendation {
  id: string;
  emotion: string;
  title?: string;
  description?: string;
  type?: string;
  content?: string;
  category?: string;
}

export interface MoodData {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  date?: string;
  score?: number;
  source?: string;
}

export interface EmotionTrackingData {
  emotion: string;
  count: number;
  percentage: number;
}

export interface EmotionHistory {
  results: EmotionResult[];
  hasMore: boolean;
}

export interface EmotionScanFormProps {
  onScanComplete?: (result: EmotionResult) => void;
  defaultTab?: string;
  isLoading?: boolean;
  error?: string;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface FacialEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  confidence?: number;
  score?: number;
}

export interface EnhancedEmotionResult extends EmotionResult {
  analysis: string;
  suggestedActions: string[];
  relatedEmotions: EmotionPrediction[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  anonymized?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
