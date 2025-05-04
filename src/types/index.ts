export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
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

// Add missing type definitions to fix build errors
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  intensity: number;
  note?: string;
  created_at?: string;
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
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  content: string;
  emotions: string[];
  is_private: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: Comment[];
  author: User;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: User;
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
}

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin'
}
