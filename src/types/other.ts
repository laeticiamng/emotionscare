
// Import the ChatMessage type from chat.ts to maintain consistency
import { ChatMessage as BaseChatMessage } from './chat';

// Extend the ChatMessage type to ensure compatibility
export type ChatMessage = BaseChatMessage;

export interface MoodData {
  timestamp: string;
  value: number;
  label?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
  mood?: string | number;
  text?: string;
  ai_feedback?: string;
  tags?: string[];
  emotions?: string[];
  mood_score?: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
}

export interface EmotionPrediction {
  emotion: string;
  probability: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  url?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected?: number;
  sent?: number;
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
  sent_at?: string;
  sent_by?: string;
}

export interface InvitationFormData {
  email: string;
  role: string;
  expiresInDays: number;
}

export interface UserPreference {
  id: string;
  userId: string;
  key: string;
  value: string;
}
