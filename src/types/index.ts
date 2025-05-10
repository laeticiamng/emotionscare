
// Types utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  avatar_url?: string;
}

export type UserRole = 'user' | 'admin' | 'coach';

// Types liés aux émotions
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  text: string;
  emojis: string;
  audio_url: string | null;
  ai_feedback: string;
  created_at: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  feedback?: string;
  date: string;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
}

// Types liés à la musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover_url?: string;
  bpm?: number;
  mood?: string;
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  mood?: string;
  cover_url?: string;
}

// Type pour les équipes et les émotions d'équipe
export interface EmotionalTeamViewProps {
  userId?: string;
  period?: string;
  teamId?: string;
  className?: string;
  onRefresh?: () => Promise<void>;
}
