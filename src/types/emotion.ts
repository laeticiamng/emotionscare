
export interface EmotionResult {
  emotion: string;
  confidence: number;
  secondaryEmotions?: string[];
  timestamp: string;
  source: 'text' | 'voice' | 'facial' | 'emoji' | 'system' | 'ai';
  text?: string;
  duration?: number;
  userId?: string;
  sessionId?: string;
  
  // Extended fields for compatibility
  id?: string;
  primaryEmotion?: string;
  score?: number;
  intensity?: number;
  feedback?: string;
  recommendations?: string[];
  emojis?: string[];
  date?: string; // Date for display
}

export type EmotionSource = 'text' | 'voice' | 'facial' | 'emoji' | 'system' | 'ai';

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

// Extended types for compatibility
export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  action?: string;
  link?: string;
  icon?: string;
  id?: string; // Added for compatibility
  emotion?: string; // Added to fix build errors
  content?: string; // Added to fix build errors
  category?: string; // Added to fix build errors
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
  setIsProcessing?: (isProcessing: boolean) => void; // Added for compatibility
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
  setIsProcessing?: (isProcessing: boolean) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export interface AudioEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  autoStart?: boolean;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
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
