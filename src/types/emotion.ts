
// Create or update this file to define emotion related types
export interface Emotion {
  id: string;
  name: string;
  intensity?: number;
  timestamp?: string;
  user_id?: string;
  emotion?: string; // For backward compatibility
  description?: string;
  color?: string;
  emoji?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity?: number;
  timestamp: string;
  source?: string;
  text?: string;
  emojis?: string[];
  emotions?: Record<string, number>;
  user_id?: string;
  textInput?: string; // Added to support existing code
  audioUrl?: string; // Added to support existing code
  facialExpression?: string; // Added to support existing code
  transcript?: string; // Added to support existing code
  
  // Add missing properties that are used in components
  score?: number;
  primaryEmotion?: string;
  feedback?: string;
  ai_feedback?: string;
  date?: string;
  recommendations?: EmotionRecommendation[];
}

// Update EmotionRecommendation to include all used properties
export interface EmotionRecommendation {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  actionLink?: string;
  actionText?: string;
  content?: string;
  category?: string;
  emotion?: string;
}

// Add these interfaces for component compatibility
export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showGraph?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

// Add these interfaces for component compatibility
export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
}

export interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
}

export interface EmojiEmotionScannerProps {
  onSelect?: (emotion: string) => void;
  onClose?: () => void;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
}

// Add EmotionScanFormProps for ScanTabContent component
export interface EmotionScanFormProps {
  userId?: string;
  onEmotionDetected?: () => void;
  onClose?: () => void;
  onScanComplete?: (result: EmotionResult) => void;
}
