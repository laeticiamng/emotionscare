
// Types liés aux émotions et analyses émotionnelles

export interface Emotion {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  intensity?: number;
  category?: string;
  emotion?: string;
  id?: string;
  confidence?: number;
  score?: number;
  date?: string;
  emoji?: string;
  text?: string;
  transcript?: string;
  audioUrl?: string;
  feedback?: string;
  userId?: string;
  user_id?: string;
  value?: number;
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
  recommendations?: EmotionRecommendation[] | string[];
  emojis?: string[] | string;
  tags?: string[];
  emotions?: Record<string, number>;
  date?: string;
  audioUrl?: string;
  audio_url?: string;
  transcript?: string;
  dominantEmotion?: {
    name: string;
    score: number;
  };
  textInput?: string;
  facialExpression?: string;
  value?: any;
  userId?: string;
  user_id?: string;
}

export interface EmotionRecommendation {
  id: string;
  emotion: string;
  title?: string;
  description?: string;
  type?: string;
  content?: string;
  category?: string;
  actionLink?: string;
  actionText?: string;
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
  value?: any;
  mood?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
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
  userId?: string;
  onEmotionDetected?: (result: EmotionResult) => void;
  onClose?: () => void;
  onProcessingChange?: (processing: boolean) => void;
  onSave?: () => void;
  onSaveFeedback?: (feedback: string) => void;
  onScanSaved?: () => void;
  onComplete?: (result: EmotionResult) => void;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FacialEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  onStartRecording?: () => void;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  autoStart?: boolean;
  scanDuration?: number; // in seconds
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  confidence?: number;
  score?: number;
  predictedEmotion?: string;
  timestamp?: string;
  source?: string;
  triggers?: string[];
  recommendations?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  analysis: string;
  suggestedActions: string[];
  relatedEmotions: EmotionPrediction[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
  showDetails?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showAverages?: boolean;
  className?: string;
}
