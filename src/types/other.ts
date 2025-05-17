
import { User } from './user';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  sender?: string;
  content: string;
  text?: string;
  timestamp: string;
}

export interface MoodData {
  id: string;
  mood: string;
  intensity: number;
  date: string;
  value?: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface JournalEntry {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  emotion?: string;
  intensity?: number;
  date: string;
  tags?: string[];
  is_private?: boolean;
  mood_score?: number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  author_id: string;
  author_name?: string;
  date: string;
  emotion?: string;
  likes: number;
  comments: number;
  is_anonymous: boolean;
  content?: string;
  tags?: string[];
  image_url?: string;
}

export interface EmotionPrediction {
  id: string;
  user_id: string;
  predicted_emotion: string;
  confidence: number;
  factors: {
    recent_activity: string;
    weather?: string;
    sleep?: string;
    work_pressure?: string;
  };
  timestamp: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  emotion_target: string;
  source: string;
  duration?: number;
  link?: string;
  is_premium?: boolean;
  thumbnail?: string;
  category?: string;
}

export interface InvitationStats {
  pending: number;
  accepted: number;
  expired: number;
  total: number;
}

export interface InvitationData {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
}

export interface InvitationFormData {
  email: string;
  role: string;
  expiration_days: number;
}

export interface UserPreference {
  id: string;
  user_id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export type { User };
