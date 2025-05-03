
export type UserRole = 'Interne' | 'Infirmier' | 'Aide-soignant' | 'Médecin' | 'Autre';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not stored in frontend
  role?: UserRole;
  avatar?: string;
  anonymity_code?: string;
  emotional_score?: number;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  awarded_at: string;
  user_id: string;
}

export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  ai_feedback?: string;
  score?: number;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  content: string;
  ai_feedback?: string;
}

export interface VRSessionTemplate {
  template_id: string;
  theme: string;
  duration: number;
  preview_url: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  location_url: string;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface Post {
  id: string;
  user_id: string;
  date: string;
  content: string;
  media_url?: string;
  image_url?: string;
  reactions: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  date: string;
  content: string;
}

export interface Group {
  id: string;
  name: string;
  topic: string;
  description?: string;
  members: string[];
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_user_id: string;
  matched_on: string;
  date: string;
}

export interface LibraryItem {
  id: string;
  type: 'meditation' | 'podcast' | 'soundscape';
  title: string;
  url: string;
  duration: number;
}

export interface Ritual {
  id: string;
  name: string;
  description: string;
  frequency: string;
  is_completed: boolean;
}

export interface Report {
  id: string;
  metric: 'absenteeism' | 'productivity' | 'emotional_score';
  period_start: string;
  period_end: string;
  value: number;
  change_pct: number;
}
