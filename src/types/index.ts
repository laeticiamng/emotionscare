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
  alias?: string;            // Added for community features
  bio?: string;              // Added for community features
  joined_at?: string;        // Added for community features
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
  text?: string;  // For compatibility
}

export interface MoodData {
  date: string;
  originalDate: Date;
  sentiment: number;
  anxiety: number;
  energy: number;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  date: string;
  reactions: number;
  image_url?: string;   // Changed from image to image_url
  author?: User;        // For the UI, not in DB
  likes?: number;       // For backward compatibility
  comments?: Comment[]; // For the UI, not in DB
  created_at?: string;  // Alias for date
  media_url?: string;   // For backward compatibility
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  date: string;
  author?: User;        // For the UI, not in DB
  created_at?: string;  // Alias for date
}

export interface Group {
  id: string;
  name: string;
  topic: string;
  description?: string;
  members?: string[];   // Array of user IDs
  members_count?: number;
  is_private?: boolean;
  created_at?: string;
  joined?: boolean;     // For the UI, not in DB
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_user_id: string;
  matched_on?: string;   // For compatibility with newer code
  date: string;          // From the database
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

// Music-related interfaces
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl?: string;
  emotion?: string; // Associated emotion
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion: string;
  tracks: MusicTrack[];
}
