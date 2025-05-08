
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  avatar?: string;
  image?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  team_id?: string;
  department?: string;
  position?: string;
  last_active?: string;
  is_verified?: boolean;
  // Adding missing properties
  emotional_score?: number;
  anonymity_code?: string;
  joined_at?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
}

// Enum for user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager'
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  language: string;
  privacy_level: string;
  notifications_enabled?: boolean;
  share_data_with_coach?: boolean;
  daily_reminder?: boolean;
  reminder_time?: string;
  fontSize?: string;
  backgroundColor?: string;
  accentColor?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  }
}

// Emotion related types
export interface EmotionResult {
  emotion: string;
  confidence?: number;
  score?: number;
  feedback?: string;
  recommendations?: string[];
  transcript?: string;
  timestamp?: string;
  emojis?: string;
  // Adding missing properties
  id?: string;
  user_id?: string;
  date?: string;
  text?: string;
  ai_feedback?: string;
}

// Extended Emotion interface
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score?: number;
  confidence?: number;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  feedback?: string;
}

// VR related types
export interface VRSessionTemplate {
  id: string;
  template_id: string;
  theme: string;
  title: string;
  duration: number;
  preview_url: string;
  description: string;
  is_audio_only: boolean;
  // Adding missing properties
  audio_url?: string;
  recommended_mood?: string;
  completion_rate?: number;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  completed: boolean;
  feedback?: string;
  mood_before?: string;
  mood_after?: string;
  template?: VRSessionTemplate;
}

// Music related types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt?: string;
  duration?: number;
  album?: string;
  genre?: string;
  audioUrl?: string;
  externalUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  tracks: MusicTrack[];
  emotion?: string;
  totalDuration?: number;
  createdBy?: string;
}

// Mood data for charts
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  label?: string;
}

// Journal related types
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  mood_score?: number;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  is_private: boolean;
}

// Badge for gamification
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  level: number;
  unlocked: boolean;
  progress?: number;
  total_required?: number;
  unlocked_at?: string;
}

// Invitation related types
export interface InvitationFormData {
  email: string;
  name?: string;
  role: string;
  team_id?: string;
  message?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  teams: Record<string, number>;
}

// Report type
export interface Report {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  type: string;
  metrics: {
    name: string;
    value: number;
    change?: number;
  }[];
  chart_data?: any;
}
