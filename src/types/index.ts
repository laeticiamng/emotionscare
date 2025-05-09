
// Export all type definitions for application-wide use

// Core types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: UserRole;
  created_at: string;
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

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

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
}

export interface MoodData {
  date: string;
  score: number;
  emotion?: string;
  notes?: string;
  activities?: string[];
  user_id: string;
}

export interface UserStats {
  user_id: string;
  total_sessions: number;
  total_duration_minutes: number;
  average_mood_score: number;
  streak_days: number;
  challenges_completed: number;
  last_activity: string;
  most_frequent_emotion?: string;
}

// VR related types
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
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
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
  template_id?: string;
  theme?: string;
  duration?: number;
  preview_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  emotions?: string[];
  popularity?: number;
  audio_url?: string;
}

export interface VRSessionStats {
  total_sessions: number;
  total_duration_minutes: number;
  avg_rating: number;
  most_used_template: {
    id: string;
    title: string;
    count: number;
  };
  emotion_improvements: Record<string, number>;
  weekly_sessions: Array<{
    date: string;
    count: number;
  }>;
}

// Emotion related types
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
  // These properties added for consistent use in components
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
  // These properties added for consistent use in components
  score?: number;
  feedback?: string;
  ai_feedback?: string;
  text?: string;
  recommendations?: string[];
  user_id?: string;
  date?: string;
}

export interface EmotionFeedbackData {
  id: string;
  user_id: string;
  emotion_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  accuracy?: number;
  usefulness?: number;
  tags?: string[];
  is_public?: boolean;
}

export interface EmotionStatistics {
  total_scans: number;
  average_intensity: number;
  most_frequent: string;
  trends: Array<{
    date: string;
    count: number;
    emotions: Record<string, number>;
  }>;
  recent_change_percent?: number;
  comparison_period?: string;
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

// Chat related types
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
  lastMessage?: string; // Added for ConversationList component
}

export interface ChatThread {
  id: string;
  title: string;
  last_message?: string;
  last_timestamp: Date;
  unread_count: number;
  is_archived?: boolean;
  context?: Record<string, any>;
}

export interface ChatSettings {
  notification_enabled: boolean;
  show_typing_indicator: boolean;
  sound_enabled: boolean;
  auto_reply?: boolean;
  suggested_replies?: boolean;
  history_retention_days?: number;
}

// Community related types
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  comments_count: number;
  tags?: string[];
  is_anonymous?: boolean;
  author?: User;
  is_featured?: boolean;
  image_url?: string;
  visibility: 'public' | 'team' | 'private';
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  parent_id?: string;
  author?: User;
  is_edited?: boolean;
  is_anonymous?: boolean;
}

export interface CommunityTag {
  id: string;
  name: string;
  count: number;
  color?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  member_count: number;
  created_at: string;
  updated_at?: string;
  is_private?: boolean;
  cover_image?: string;
  owner_id: string;
  tags?: string[];
  topic?: string; // Added for GroupItem component
  members?: Array<any>; // Added for GroupItem component
}

// Journal related types
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

export interface JournalPrompt {
  id: string;
  text: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'deep';
  emotional_state?: string[];
  tags?: string[];
  is_favorite?: boolean;
  used_count?: number;
  created_at?: string;
}

export interface JournalStatistics {
  total_entries: number;
  streak_days: number;
  most_common_emotion: string;
  average_mood: number;
  total_words: number;
  most_active_day: string;
  entries_by_month: Record<string, number>;
  mood_evolution: Array<{
    date: string;
    mood: number;
  }>;
}

export interface JournalSettings {
  reminder_time?: string;
  reminder_enabled: boolean;
  default_privacy: 'private' | 'public';
  ai_analysis_enabled: boolean;
  export_format: 'pdf' | 'markdown' | 'txt';
  storage_limit_days?: number;
}

// Invitation related types
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

// Navigation related types
export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: NavigationItem[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface MobileNavigationProps {
  items: NavigationItem[];
  open?: boolean;
  onClose?: () => void;
  user?: any;
}

// Music related types
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

// Audio player types
export interface PlayerControlsProps {
  isPlaying: boolean;
  loadingTrack?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

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
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

export interface AudioPlayerOptions {
  autoplay?: boolean;
  volume?: number;
  muted?: boolean;
  loop?: boolean;
}

// Gamification types
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

// Re-export types from individual files
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
