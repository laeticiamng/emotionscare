
// If this file doesn't exist, let's create it with proper type definitions

// User types
export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  emotional_score?: number;
  team_id?: string;
  team_name?: string;
}

// Emotion types
export interface Emotion {
  id: string;
  user_id: string;
  date: string; // ISO format date string
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  confidence?: number;
  source?: string;
}

export interface EmotionResult {
  emotion: string;
  confidence?: number;
  transcript?: string;
  feedback?: string;
}

// Badge types
export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  icon_url?: string;
  category: string;
  unlocked: boolean;
  awarded_at: string; // ISO format date string
  threshold?: number;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress: number;
  total: number;
  category: string;
}
