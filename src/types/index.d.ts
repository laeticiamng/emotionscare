
// Types globaux pour l'application

// Type pour les émotions
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score?: number;
  intensity?: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  confidence?: number;
  source?: string;
  recommendations?: string[];
}

// Type pour les résultats d'analyse émotionnelle
export interface EmotionResult {
  emotion: string;
  confidence: number;
  transcript?: string;
  feedback?: string;
  id?: string;
  user_id?: string;
  date?: string;
  intensity?: number;
  score?: number;
  recommendations?: string[];  // Added this property to fix the type error
}

// Ajouter d'autres types globaux au besoin
