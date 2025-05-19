
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
  timestamp: string;
  source?: string;
  context?: string;
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

export type EmotionSource = 'voice' | 'text' | 'emoji' | 'ai' | 'default' | 'system';
