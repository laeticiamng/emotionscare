
// Types globaux pour l'application

// Type pour les utilisateurs
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string; // Added for compatibility
  image?: string;  // Added for compatibility
  role?: string;
  created_at?: string;
  last_login?: string;
  anonymity_code?: string;
  emotional_score?: number;
  onboarded?: boolean;
  joined_at?: string;
  preferences?: UserPreferences;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ANALYST = 'analyst',
  MANAGER = 'manager'
}

// Type pour les émotions
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score?: number;
  tags?: string[];
  context?: string;
  notes?: string;
  text?: string;
  emojis?: string;
  intensity?: number;
  ai_feedback?: string;
  confidence?: number;
  audio_url?: string;
  source?: string;
  is_confidential?: boolean;
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
  recommendations?: string[];
}

// Enhanced version for API compatibility
export interface EnhancedEmotionResult extends EmotionResult {
  emotion: string;
  feedback: string;
}

// Sessions VR
export interface VRSession {
  id?: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  location_url: string;
  heart_rate_before?: number | null;
  heart_rate_after?: number | null;
  is_audio_only?: boolean;
}

export interface VRSessionTemplate {
  id: string;
  template_id?: string; // Added for compatibility with mock data
  theme: string;
  title?: string;
  description?: string;
  duration: number;
  preview_url: string;
  is_audio_only?: boolean;
  audio_url?: string;
  recommended_mood?: string;
  completion_rate?: number;
}

// Musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  coverImage?: string;
  audioUrl: string;
  externalUrl?: string;
  mood?: string;
  isPlaying?: boolean;
  // For compatibility
  url?: string;
  cover?: string;
  coverUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  mood?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

// Notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Scan émotionnel
export interface EmotionScanResult {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  tags?: string[];
  context?: string;
  notes?: string;
}

// Badge
export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  icon_url?: string;
  category: string;
  unlocked: boolean;
  awarded_at?: string;
  threshold?: number;
}

// Badge API response
export interface BadgeResponse {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category: string;
  unlocked: boolean;
}

// Journal entries
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title?: string;
  content?: string;
  text?: string;
  mood?: string;
  mood_score?: number;
  tags?: string[];
  ai_feedback?: string;
  visibility?: 'private' | 'public' | 'anonymous';
}

// User preferences
export interface UserPreferences {
  theme: "light" | "dark" | "system" | "pastel";
  fontSize: "small" | "medium" | "large";
  backgroundColor: string;
  accentColor: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// For chart data
export interface MoodData {
  date: string;
  value: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  originalDate?: string;
}

// Reports
export interface Report {
  id: string;
  date: string;
  title: string;
  data: {
    metrics: {
      [key: string]: number;
    };
  };
  type: string;
  user_id: string;
  summary: string;
  mood_score: number;
  categories: string[];
  recommendations: string[];
  metric: string;
  period_start: string;
  period_end: string;
  value: number;
  change_pct: number;
}

// Invitation types
export interface InvitationFormData {
  email: string;
  role: string;
}

export interface InvitationStats {
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
}

// Explicitly export the InvitationVerificationResult type
export type InvitationVerificationResult = {
  valid: boolean;
  message: string;
  token?: string;
  role?: string;
  email?: string;
};

// Challenge type for gamification
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
  category?: string;
  requirements?: string[];
}

// Activity logs types
export interface AnonymousActivity {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

export interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}

export type ActivityTabView = 'daily' | 'stats';

export interface ActivityFiltersState {
  searchTerm: string;
  activityType: string;
  startDate?: Date;
  endDate?: Date;
}

// Chart data
export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  averageScore: number;
  criticalAlerts: number;
  completion: number;
  productivity: {
    current: number;
    trend: number;
  };
  emotionalScore: {
    current: number;
    trend: number;
  };
}

export interface GamificationData {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels?: Array<{ level: string; count: number }>;
  topChallenges?: Array<{ name: string; completions: number }>;
}

// Coach types
export type CoachEmotionData = {
  emotion: string;
  score: number;
};

// Scan types
export interface ScanInput {
  emojis?: string;
  text?: string;
  audio_url?: string;
  user_id: string;
}

export interface ScanResponse {
  emotion: Emotion;
  feedback: string;
  score: number;
}

// Music types
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}

// Chat types
export interface UserContext {
  recentEmotions: string | null;
  currentScore: number | null;
  lastEmotionDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach' | 'system';
  content: string;
  timestamp: Date;
  type?: string;
  media?: {
    url: string;
    type: string;
  };
}
