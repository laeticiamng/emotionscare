// Types principaux pour EmotionsCare
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'consumer' | 'employee' | 'manager' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface EmotionScan {
  id: string;
  user_id: string;
  emotions: {
    joie: number;
    tristesse: number;
    colere: number;
    peur: number;
    surprise: number;
    degout: number;
  };
  confidence: number;
  scan_type: 'text' | 'voice' | 'facial';
  raw_data: any;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_score: number;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface MusicSession {
  id: string;
  user_id: string;
  track_name: string;
  duration: number;
  genre: string;
  mood_context: string;
  effectiveness_rating?: number;
  created_at: string;
}

export interface CoachConversation {
  id: string;
  user_id: string;
  title: string;
  messages: CoachMessage[];
  coach_mode: 'empathetic' | 'motivational' | 'analytical';
  session_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  content: string;
  timestamp: string;
  context?: any;
}

export interface VRSession {
  id: string;
  user_id: string;
  environment: string;
  duration: number;
  completion_rate: number;
  stress_reduction: number;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'mindfulness' | 'social' | 'physical' | 'creative';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  duration_days: number;
  completion_criteria: any;
}

export interface UserProgress {
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  badges_earned: string[];
  level: number;
  challenges_completed: number;
  last_activity: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  employee_count: number;
  wellness_score: number;
  active_users: number;
  admin_users: string[];
}

// Enums utiles
export enum EmotionType {
  JOY = 'joie',
  SADNESS = 'tristesse',
  ANGER = 'colere',
  FEAR = 'peur',
  SURPRISE = 'surprise',
  DISGUST = 'degout'
}

export enum UserRole {
  CONSUMER = 'consumer',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export enum ScanType {
  TEXT = 'text',
  VOICE = 'voice',
  FACIAL = 'facial'
}