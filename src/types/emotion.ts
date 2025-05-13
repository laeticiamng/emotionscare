
export interface Emotion {
  name: string;
  intensity?: number;
  score?: number; // Added for compatibility
  source?: string; // Added for compatibility
}

export interface EmotionResult {
  emotions: Emotion[];
  dominantEmotion: Emotion;
  timestamp?: string;
  score?: number;
  source?: 'text' | 'voice' | 'facial' | 'combined';
  userId?: string;
  id?: string;
  text?: string;
  primaryEmotion?: string; // Added for compatibility
  error?: string; // Added for compatibility
  faceDetected?: boolean; // Added for compatibility
  confidence?: number; // Added for compatibility
}

export interface EmotionalStateEntry {
  id: string;
  timestamp: string;
  userId: string;
  emotions: Emotion[];
  dominantEmotion: string;
  notes?: string;
  source: 'text' | 'voice' | 'facial' | 'combined';
  context?: string;
}

export interface EmotionHistory {
  entries: EmotionalStateEntry[];
  trends?: EmotionTrend[];
}

export interface EmotionTrend {
  emotion: string;
  values: number[];
  timestamps: string[];
}

export type EmotionSource = 'text' | 'voice' | 'facial' | 'combined';

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  triggers?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  insights?: string;
  recommendations?: string[];
  triggers?: string[];
  predictedEmotions?: EmotionPrediction[];
}

export interface TextEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  text?: string; // Added for compatibility
  onTextChange?: (text: string) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export interface VoiceEmotionAnalyzerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  isListening?: boolean;
  onToggleListening?: () => void;
}

export interface FacialEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  isScanning?: boolean;
  onToggleScanning?: () => void;
}

export interface UnifiedEmotionCheckinProps {
  onScanComplete?: (result: EmotionResult) => void;
}
