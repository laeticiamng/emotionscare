
export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  timestamp?: string;
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
  transcript?: string;
}

export type EmotionSource =
  | 'text'
  | 'voice'
  | 'facial'
  | 'emoji'
  | 'system'
  | 'ai'
  | 'live-voice'
  | 'voice-analyzer'
  | 'audio-processor';

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
}

export interface EmojiEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  onResult?: (result: EmotionResult) => void; // Added for compatibility
  isProcessing?: boolean; // Added for compatibility
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>; // Added for compatibility
  onProcessingChange?: (isProcessing: boolean) => void; // Added for compatibility
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean; // Added for compatibility
  dateRange?: [Date, Date]; // Added for compatibility
  showGraph?: boolean; // Added for compatibility
  showMembers?: boolean; // Added for compatibility
  className?: string; // Added for compatibility
  showDetails?: boolean; // Added for compatibility
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
