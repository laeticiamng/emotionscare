
// Export all type definitions for application-wide use

// Core types
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

// Base types
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
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
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
}
