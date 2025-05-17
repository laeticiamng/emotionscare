
export interface ChatMessage {
  id: string;
  role: "system" | "user" | "ai" | "assistant" | "coach";
  content: string;
  timestamp?: string;
  text?: string;
}

export interface MoodData {
  id: string;
  mood: string;
  intensity: number;
  date?: string;
  timestamp?: string;
  value?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  author?: string;
  published?: string;
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
  source?: string;
}

export interface InvitationStats {
  sent: number;
  accepted: number;
  pending: number;
  expired: number;
}

export interface InvitationData {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  acceptedAt?: string;
}

export interface InvitationFormData {
  email: string;
  role?: string;
  message?: string;
}

export interface UserPreference {
  theme: string;
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
}
