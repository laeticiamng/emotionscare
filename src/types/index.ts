export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  onboarded?: boolean;
  created_at?: string;
  metadata?: any;
  emotional_score?: number;
  anonymity_code?: string;
}

export interface VRSessionTemplate {
  template_id: string;
  theme: string;
  duration: number;  // in minutes
  preview_url: string;
  is_audio_only?: boolean;
  audio_url?: string;
  completion_rate?: number;
}

export interface VRSession {
  id: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  location_url: string;
  heart_rate_before: number;
  heart_rate_after: number | null;
  is_audio_only?: boolean;
}

export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;      // ex. "stress", "joie"
  intensity: number;    // de 1 à 10
  score?: number;       // pour l'historique
  text?: string;        // feedback IA
  ai_feedback?: string; // dans EmotionFeedback
  emojis?: string;      // pour la compatibilité avec les données existantes
  audio_url?: string;   // pour les enregistrements audio
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  unlocked: boolean;
  unlocked_date?: string;
  progress?: number;
  total?: number;
  threshold?: number;    // Pour la compatibilité avec BadgeGrid
  icon_url?: string;     // Pour la compatibilité avec BadgeGrid
  awarded_at?: string;   // Pour la compatibilité avec les données existantes
  user_id?: string;      // Pour la compatibilité avec mockBadges
}

export interface Report {
  id: string;
  user_id: string;
  date: string;
  title: string;
  summary: string;
  mood_score: number;
  categories: string[];
  recommendations: string[];
  metric?: string;        // Pour la compatibilité avec les données existantes
  period_start?: string;  // Pour la compatibilité avec les données existantes
  period_end?: string;    // Pour la compatibilité avec les données existantes
  value?: number;         // Pour la compatibilité avec les données existantes
  change_pct?: number;    // Pour la compatibilité avec les données existantes
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  ai_feedback: string | null;
  text?: string;  // For compatibility with existing components
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: Comment[];
  author: User;
  date?: string;        // For compatibility with types/community
  reactions?: number;   // For compatibility with types/community
  media_url?: string;   // For compatibility with types/community
  image_url?: string;   // For compatibility with types/community
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: User;
  date?: string;        // For compatibility with types/community
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members_count: number;
  image_url?: string;
  is_private: boolean;
  created_at: string;
  joined: boolean;
  topic?: string;       // For compatibility with types/community
  members?: string[];   // For compatibility with types/community
}

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  INTERNE = 'Interne',
  INFIRMIER = 'Infirmier',
  AIDE_SOIGNANT = 'Aide-soignant',
  MEDECIN = 'Médecin',
  AUTRE = 'Autre'
}
