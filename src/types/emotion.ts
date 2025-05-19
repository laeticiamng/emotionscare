
export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  timestamp?: string;
  tags?: string[];
  value?: number;
}

export interface EmotionRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  emotion?: string;
  content?: string;
  category?: string;
  action?: string;
  link?: string;
  icon?: string;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  tags?: string[];
  actionLink?: string;
  actionText?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity?: number;
  secondaryEmotions?: string[];
  timestamp?: string;
  source?: EmotionSource;
  text?: string;
  duration?: number;
  userId?: string;
  sessionId?: string;
  language?: string;
  data?: EmotionData[];
  tags?: string[]; // Added tags property

  // Extended fields for compatibility
  id?: string;
  primaryEmotion?: string;
  score?: number;
  feedback?: string;
  recommendations?: EmotionRecommendation[];
  triggers?: string[];
  context?: object;
  model?: string;
  raw?: any;
  ai_feedback?: string;
  emojis?: string[];
  emotions?: Record<string, number>;
  date?: string; // Date for display
  audioUrl?: string;
  audio_url?: string; // Alternative name
  transcript?: string;
  facialExpression?: string;
  textInput?: string;
  user_id?: string; // Alternative name
  isLoading?: boolean;
}

export type EmotionSource =
  | 'text'
  | 'voice'
  | 'facial'
  | 'emoji'
  | 'system'
  | 'ai'
  | 'manual'
  | 'live-voice'
  | 'voice-analyzer'
  | 'audio-processor'
  | 'text-analysis';

export interface EmotionHistoryItem extends EmotionResult {
  id: string;
}

export interface EmotionAnalysisOptions {
  includeSecondary?: boolean;
  detailed?: boolean;
  language?: string;
  sensitivity?: number;
}

export interface EmotionTrend {
  emotion: string;
  count: number;
  percentage: number;
}

export interface EmotionalState {
  dominant: string;
  secondary: string[];
  baseline: string;
  trends: EmotionTrend[];
  recentHistory: EmotionHistoryItem[];
}

export interface Emotion {
  name: string;
  color: string;
  icon?: string;
  description?: string;
  id?: string;
  emotion?: string;
  emoji?: string;
  confidence?: number;
  intensity?: number;
  date?: string;
  source?: string;
  text?: string;
  transcript?: string;
  audioUrl?: string;
  feedback?: string;
  score?: number;
  userId?: string;
  user_id?: string;
}

export interface MoodData {
  emotion: string;
  intensity: number;
  date?: string;
  timestamp: string;
  context?: string;
  source?: string;
  id?: string;
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  triggers?: string[];
  timeframe?: string;
  recommendations?: string[];
}

export interface EmojiEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
  showDetails?: boolean;
}

export interface TextEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export interface AudioEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  autoStart?: boolean;
}

export interface VoiceEmotionScannerProps {
  onEmotionDetected: (result: EmotionResult) => void;
}

export interface VoiceEmotionAnalyzerProps {
  onResult: (result: EmotionResult) => void;
  onStartRecording?: () => void;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
  autoStart?: boolean;
  scanDuration?: number;
}

export interface EmotionScanFormProps {
  onScanComplete: (result: EmotionResult) => void;
  onEmotionDetected?: () => void;
  onClose?: () => void;
  userId?: string;
}
