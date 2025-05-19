
export interface Emotion {
  id: string;
  name: string;
  label?: string;
  color: string;
  icon?: string;
  description?: string;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity?: number;
  secondaryEmotions?: string[];
  timestamp?: string;
  source?:
    | 'text'
    | 'voice'
    | 'facial'
    | 'emoji'
    | 'system'
    | 'ai'
    | 'live-voice'
    | 'voice-analyzer'
    | 'audio-processor';
  text?: string;
  duration?: number;
  userId?: string;
  sessionId?: string;
  language?: string;
  data?: EmotionData[];
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
  date?: string;
  audioUrl?: string;
  transcript?: string;
}

export interface EmotionRecommendation {
  id: string;
  type: 'activity' | 'reflection' | 'breathing' | 'music' | 'social';
  title: string;
  description: string;
  icon?: string;
  duration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  onStart?: () => void;
  onStop?: () => void;
  autoStart?: boolean;
  duration?: number;
  showFeedback?: boolean;
  compact?: boolean;
}

export interface EmotionalTeamViewProps {
  showHeader?: boolean;
  showLegend?: boolean;
  height?: string | number;
  width?: string | number;
  filter?: string[];
}

export interface TextEmotionScannerProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  placeholder?: string;
  defaultText?: string;
  minLength?: number;
  maxLength?: number;
  showResults?: boolean;
  autoAnalyze?: boolean;
}

export interface EmojiEmotionScannerProps {
  onEmotionSelected?: (emoji: string, emotion: string) => void;
  size?: 'sm' | 'md' | 'lg';
  grid?: boolean;
  preselected?: string;
}

export interface VoiceEmotionScannerProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
  showFeedback?: boolean;
  showTimer?: boolean;
  compact?: boolean;
}

export interface VoiceEmotionAnalyzerProps {
  audioUrl: string;
  onAnalysisComplete?: (result: EmotionResult) => void;
  autoPlay?: boolean;
  showWaveform?: boolean;
  showResult?: boolean;
}

export interface EmojiEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  onProcessingChange?: (isProcessing: boolean) => void;
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
