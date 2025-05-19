
export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  timestamp?: string;
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

export interface EmotionTrigger {
  name: string;
  description: string;
  intensity: number;
  emotion: string;
  timestamp: string;
  context?: string;
  tags?: string[];
}

export interface EmotionReport {
  id: string;
  userId: string;
  date: string;
  emotions: EmotionData[];
  dominantEmotion: string;
  averageIntensity: number;
  triggers?: EmotionTrigger[];
  recommendations?: EmotionRecommendation[];
  notes?: string;
  tags?: string[];
}

export interface EmotionChartData {
  name: string;
  value: number;
  color?: string;
}

export interface EmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  initialTab?: 'emoji' | 'text' | 'facial' | 'voice';
}

export interface EmotionScanResult {
  emotion: string;
  intensity: number;
  confidence: number;
  timestamp: string;
  source: "text" | "voice" | "facial" | "emoji" | "system" | "ai";
  recommendations?: string[];
}

export interface EmotionScanFormProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  onClose?: () => void;
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
