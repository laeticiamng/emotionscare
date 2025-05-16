
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: string | Date;
  seen?: boolean;
}

export interface MoodData {
  id: string;
  mood: string;
  score: number;
  timestamp: string | Date;
  notes?: string;
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
}

export interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  seen?: boolean;
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
}

export interface InvitationData {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string | Date;
  expires_at?: string | Date;
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
