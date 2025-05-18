
export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string; // Pour compatibilité
  description?: string;
  duration: number;
  environment: string;
  intensity: number;
  tags: string[];
  objective: string;
  coverImage?: string;
  audioTrack?: string;
  audio_url?: string; // Pour compatibilité
  preview_url?: string; // Pour compatibilité
  thumbnailUrl?: string; // Pour compatibilité
  lastUsed?: string; // Pour compatibilité
  category?: string; // Pour compatibilité
  difficulty?: string; // Pour compatibilité
  benefits?: string[]; // Pour compatibilité
  is_audio_only?: boolean; // Pour compatibilité
  emotion?: string; // Ajouté pour compatibilité avec VRTemplateDetail
  theme?: string; // Ajouté pour compatibilité avec VRTemplateDetail
  completionRate?: number; // Ajouté pour compatibilité avec VRTemplateDetail
  completion_rate?: number; // Ajouté pour compatibilité avec VRTemplateDetail
  recommendedMood?: string; // Ajouté pour compatibilité avec VRTemplateDetail
  recommended_mood?: string; // Ajouté pour compatibilité avec VRTemplateDetail
  imageUrl?: string; // Ajouté pour compatibilité avec VRTemplateDetail
  coverUrl?: string; // Ajouté pour compatibilité avec VRTemplateDetail
  cover_url?: string; // Ajouté pour compatibilité avec VRTemplateDetail
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  feedback?: string | { rating?: number; comments?: string };
  rating?: number;
  metrics?: {
    focusLevel?: number;
    relaxationLevel?: number;
    heartRate?: number[];
    breathingRate?: number[];
  };
  startedAt?: Date | string; // Pour compatibilité
  endedAt?: Date | string; // Pour compatibilité
  completedAt?: Date | string; // Pour compatibilité
  end_time?: Date | string; // Pour compatibilité
  date?: string; // Pour compatibilité
  template?: VRSessionTemplate; // Pour compatibilité
  duration?: number; // Pour compatibilité
  heartRateBefore?: number; // Pour compatibilité
  heartRateAfter?: number; // Pour compatibilité
  emotionBefore?: string; // Pour compatibilité
  emotionAfter?: string; // Pour compatibilité
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  template: VRSessionTemplate;
  useMusic?: boolean;
  onComplete?: (feedback: string, rating: number) => void;
  // Ajout des propriétés manquantes utilisées dans VRSessionWithMusic.tsx
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}

// Ajout du type manquant VRSessionHistoryProps
export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}
