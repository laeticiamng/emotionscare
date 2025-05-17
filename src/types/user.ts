
export type UserRole = 'user' | 'admin' | 'b2b_user' | 'b2b_admin' | 'b2c' | 'coach' | 'therapist';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  isActive?: boolean;
  job_title?: string;
  department?: string;
  notifications_enabled?: boolean;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  joined_at?: string;
  position?: string;
  emotional_score?: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
}

export interface UserWithStatus {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  last_active?: string;
  department?: string;
  firstName?: string;
  lastName?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  unlocked: boolean;
  level: number;
  category: string;
  tier?: string;
  icon?: string;
  earned?: boolean;
  progress?: number;
  threshold?: number;
  completed?: boolean;
  rarity?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  goal: number;
  category: string;
  completed: boolean;
  status: string;
  name?: string;
  totalSteps?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  avatar?: string;
  name?: string;
}
