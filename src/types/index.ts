
// Export all type definitions for application-wide use

// Core types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  team_id?: string;
  is_active?: boolean;
  last_login?: string;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
  department?: string;
  position?: string;
}

export interface UserPreferences {
  theme?: string;
  notifications_enabled?: boolean;
  font_size?: string;
  language?: string;
  [key: string]: any;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager', 
  USER = 'user',
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface MoodData {
  date: string;
  score: number;
  emotion?: string;
  notes?: string;
  activities?: string[];
  user_id: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  previousSentiment?: number | null;
  previousAnxiety?: number | null;
  previousEnergy?: number | null;
  value?: number; // For compatibility with older components
}

// Chat-related types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: string;
  emotion_score?: number;
  is_read?: boolean;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title?: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at?: Date; 
  tags?: string[];
  user_id: string;
  summary?: string;
  context?: Record<string, any>;
  lastMessage?: string;
}

export interface ChatResponse {
  text: string;
  metadata?: Record<string, any>;
}

export interface UserContext {
  userId: string;
  userName: string;
  emotion?: string;
  emotionScore?: number;
  recentTopics?: string[];
}

// Emotion-related types
export interface Emotion {
  id: string;
  user_id: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  created_at: string;
  intensity?: number;
  feedback?: string;
  tags?: string[];
  notes?: string;
  emojis?: string;
  valence?: number;
  arousal?: number;
  is_acknowledged?: boolean;
  related_activity?: string;
  metadata?: Record<string, any>;
  context?: string;
  score?: number;
  text?: string;
  date?: string;
  ai_feedback?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  transcript?: string;
  intensity?: number;
  emojis?: string;
  valence?: number;
  arousal?: number;
  timestamp?: string;
  id?: string;
  metadata?: Record<string, any>;
  score?: number;
  feedback?: string;
  ai_feedback?: string;
  text?: string;
  recommendations?: string[];
  user_id?: string;
  date?: string;
}

export interface EnhancedEmotionResult {
  emotion: string;
  confidence: number;
  feedback: string;
  recommendations: string[];
  transcript?: string;
  intensity?: number;
  valence?: number;
  arousal?: number;
}

// Music-related types
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover_url?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  tracks: MusicTrack[];
  emotion?: string;
  description?: string;
}

export interface MusicPreferences {
  autoplay: boolean;
  volume: number;
  repeat_mode: 'none' | 'all' | 'one';
  shuffle: boolean;
  favorite_genres: string[];
  favorite_tracks: string[];
  favorite_emotions?: string[];
}

// VR-related types
export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  emotion_before?: string;
  emotion_after?: string;
  notes?: string;
  rating?: number;
  is_completed: boolean;
  music_track_id?: string;
  music_track?: MusicTrack;
  heart_rate_before?: number;
  heart_rate_after?: number;
  duration?: number;
  date?: string;
  is_audio_only?: boolean;
}

export interface VRSessionTemplate {
  id: string;
  template_id?: string;
  title: string;
  description: string;
  duration_minutes: number;
  duration?: number;
  category: string;
  image_url?: string;
  is_guided: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  recommended_emotions?: string[];
  scenery_type?: string;
  has_music?: boolean;
  has_narration?: boolean;
  creator_id?: string;
  is_featured?: boolean;
  avg_rating?: number;
  total_sessions?: number;
  theme?: string;
  preview_url?: string;
  is_audio_only?: boolean;
  completion_rate?: number;
}

// Journal-related types
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  created_at: string;
  updated_at?: string;
  mood?: number;
  tags?: string[];
  is_private?: boolean;
  emotion?: string;
  ai_insights?: string;
  ai_feedback?: string;
  color?: string;
}

// Invitation-related types
export interface Invitation {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  team_id?: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  created_by: string;
  token: string;
  message?: string;
  reminder_sent_at?: string;
  reminder_count?: number;
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  team_id?: string;
  expiration_days?: number;
  message?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  sent: number;
  rejected: number;
  teams?: Record<string, number>;
  recent_invites?: any[];
}

// Gamification-related types
export interface Badge {
  id: string;
  title: string;
  description: string;
  image_url: string;
  criteria: string;
  category?: string;
  points?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked_at?: string;
  progress?: number;
  user_id?: string;
  name?: string; // Additional property used in BadgeGrid
  icon_url?: string; // Additional property used in BadgeGrid
  threshold?: number; // Additional property used in BadgeGrid
}

export interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  data: any;
  type: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Audio player related types
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack | null;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

// Export specific type files - these might contain additional types beyond what's defined here
export * from './audio-player';
export * from './chat';
export * from './community';
export * from './emotion';
export * from './gamification';
export * from './invitation';
export * from './journal';
export * from './music';
export * from './navigation';
export * from './scan';
export * from './vr';
