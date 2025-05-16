
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system' | 'assistant';
  timestamp: string | Date;
  seen?: boolean;
  role?: 'user' | 'ai' | 'system' | 'assistant';
}

export interface MoodData {
  id: string;
  mood: string;
  score: number;
  timestamp: string | Date;
  notes?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string | Date;
  updated_at?: string | Date;
  tags?: string[];
  user_id?: string;
  date?: string | Date;
  text?: string;
  mood_score?: number;
  ai_feedback?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  seen?: boolean;
  type?: string;
}

export interface EmotionPrediction {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: string | Date;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: number;
  completed?: boolean;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired?: number;
  sent?: number;
  completed?: number;
  conversionRate?: number;
  averageTimeToAccept?: number;
  teams?: Record<string, number>;
  recent_invites?: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string | Date;
  expires_at?: string | Date;
  accepted_at?: string | Date;
}

export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expires_in?: number;
}

export interface UserPreference {
  key: string;
  value: any;
  label?: string;
  description?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  created_at: string | Date;
  link?: string;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';
