
export interface ChatMessage {
  id: string;
  text: string;
  content?: string;
  sender: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  isLoading?: boolean;
}

export interface MoodData {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  value?: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  originalDate?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  user_id: string;
  tags?: string[];
  emotion?: string;
  mood_score?: number;
  ai_feedback?: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  mood: string;
  imageUrl?: string;
  audioUrl?: string;
  type: 'short' | 'long' | 'guided';
  tags: string[];
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  confidence: number;
  predictedEmotion?: string;
  triggers?: string[];
  recommendations?: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: number;
  completed: boolean;
  emotion?: string;
}

export interface InvitationStats {
  sent: number;
  accepted: number;
  pending: number;
  conversion_rate: number;
  last_sent: string[];
}

export interface InvitationData {
  id: string;
  email: string;
  name: string;
  status: 'sent' | 'accepted' | 'expired';
  sent_at: string;
  accepted_at?: string;
  expired_at?: string;
  sent_by: string;
  role: string;
}

export interface InvitationFormData {
  email: string;
  name: string;
  role: string;
  message?: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  sound_enabled: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}
