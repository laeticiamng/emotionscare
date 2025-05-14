
// Update the Emotion type with more fields
export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string | Date;
  emotion?: string;
  name?: string;
  score?: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  category?: string;
  confidence?: number; // Added for EmotionScanForm and EnhancedCoachAI
}

// Create a more comprehensive EmotionResult interface
export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  dominantEmotion?: string; // For EmotionScanner
  primaryEmotion?: string; // For EnhancedCoachAI
  emotion?: string;
  score?: number;
  intensity?: number;
  text?: string;
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  confidence?: number;
}

// Enhanced emotion result for detailed analysis
export interface EnhancedEmotionResult extends EmotionResult {
  detailedAnalysis?: {
    triggers?: string[];
    patterns?: string[];
    suggestions?: string[];
  };
  relatedEmotions?: {
    name: string;
    score: number;
  }[];
  trendData?: {
    period: string;
    value: number;
  }[];
}

// Add the EmotionalTeamViewProps interface
export interface EmotionalTeamViewProps {
  teamId: string;
  userId: string;
  period: string;
  className?: string;
  onRefresh?: () => void;
}
