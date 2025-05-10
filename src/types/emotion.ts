
export interface Emotion {
  id?: string;
  user_id?: string;
  date: string | Date;
  score: number;
  emotion: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  ai_feedback?: string;
  timestamp?: string | Date; // Pour compatibilité
  created_at?: string | Date; // Pour compatibilité
  name?: string; // Pour compatibilité avec VR
  confidence?: number; // Niveau de confiance de l'analyse
  intensity?: number; // Intensité de l'émotion
  category?: string; // Catégorie d'émotion
  dominant_emotion?: string; // Pour compatibilité
  is_confidential?: boolean; // Pour confidentialité
  source?: string; // Source de l'émotion (texte, audio, etc.)
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion: string;
  score: number;
  feedback?: string;
  text?: string;
  transcript?: string;
  emojis?: string;
  date?: string | Date;
  confidence?: number;
  intensity?: number;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
  primaryEmotion?: {
    name: string;
    score: number;
  };
}

export interface EmotionalTeamViewProps {
  userId: string;
  period: string;
  teamId?: string;
  className?: string;
  onRefresh?: () => void;
}

export interface EnhancedEmotionResult extends EmotionResult {
  recommendations?: {
    activities?: string[];
    music?: string[];
    breathing?: string[];
  };
  timestamp: Date;
}
