
export interface EmotionResult {
  id?: string;
  date?: string;
  emotion: string; 
  score: number;
  intensity?: number;
  confidence: number;
  text?: string;
  emojis: string[];
  recommendations?: string[];
  audioUrl?: string;
  source?: 'text' | 'voice' | 'video' | 'manual';
}

export interface Emotion {
  emotion: string;
  score: number;
  confidence: number;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  continuous?: boolean;
  autoStart?: boolean;
  renderControls?: boolean;
  className?: string;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  continuous?: boolean;
  autoStart?: boolean;
  className?: string;
}

export interface AudioProcessorProps {
  headerText?: string;
  subHeaderText?: string;
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  continuous?: boolean;
}
