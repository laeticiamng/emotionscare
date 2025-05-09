
// Common types used across the application

// User related types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  USER = 'user',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
  team_id?: string;
  created_at?: string;
  last_login?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'pastel';
  notifications_enabled: boolean;
  font_size: 'small' | 'medium' | 'large';
  language: string;
  accent_color?: string;
  background_color?: string;
}

// Emotion related types
export interface Emotion {
  id: string;
  user_id: string;
  emotion: string;
  confidence: number;
  date: string;
  score: number;
  text?: string;
  emojis?: string[];
  ai_feedback?: string;
  intensity?: number;
  source?: string;
  transcript?: string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion: string;
  confidence: number;
  score?: number;
  transcript?: string;
  text?: string;
  emojis?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  source?: string;
}

// Report related types
export interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  data: any;
  date: string;
  created_at?: string;
  metrics?: any;
  description?: string;
}

// Badge related types
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  user_id: string;
  icon?: string;
  level?: number;
  awarded_at?: string;
}

// Challenge related types
export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  deadline?: string;
  total?: number;
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
  audio_url?: string;
  recommended_mood?: string;
  category: string;
  benefits: string[];
  emotions: string[];
  popularity: number;
}

// Journal related types
export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  title: string;
  mood: string;
  created_at: string;
  ai_feedback?: string;
  text?: string;
  mood_score: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Music related types
export interface MusicTrack {
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
  tracks: MusicTrack[];
  emotion?: string;
}

// Invitation types
export interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected?: number;
  teams?: Record<string, number>;
  recent_invites?: any[];
}

// Navigation types
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}
