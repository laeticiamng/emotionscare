
export interface Emotion {
  name: string;
  intensity?: number;
  score?: number;
  source?: string;
  confidence?: number; // Adding confidence property
  category?: string;
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
  primaryEmotion?: string;
  error?: string;
  faceDetected?: boolean;
  confidence?: number;
  intensity?: number;
  emotion?: string; // Adding for backward compatibility
  audio_url?: string; // Adding for backward compatibility
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
  recommendations?: string[];
  predictedEmotion?: string; // Adding for backward compatibility
}

export interface EnhancedEmotionResult extends EmotionResult {
  insights?: string;
  recommendations?: string[];
  triggers?: string[];
  predictedEmotions?: EmotionPrediction[];
}

export interface TextEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  text?: string;
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

export interface EmotionalTeamViewProps {
  userId?: string;
  period?: string;
  teamId?: string;
  className?: string;
  onRefresh?: () => Promise<void>;
}

export interface EmotionScanFormProps {
  userId: string;
  onScanSaved?: () => void;
  onClose?: () => void;
}
