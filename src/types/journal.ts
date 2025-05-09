
// Journal related types

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  created_at: string;
  updated_at?: string;
  mood?: number;
  tags?: string[];
  is_private?: boolean;
  emotion?: string;
  ai_insights?: string;
  ai_feedback?: string;
  color?: string;
}

export interface JournalPrompt {
  id: string;
  text: string;
  category: string;
  emotion?: string;
  recommended_for?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface JournalStats {
  total_entries: number;
  streak_days: number;
  current_month_entries: number;
  average_mood?: number;
  most_used_tags?: string[];
  most_frequent_emotion?: string;
  completion_rate?: number;
}

export interface JournalSettings {
  reminder_time?: string;
  reminder_days: string[];
  reminder_enabled: boolean;
  default_privacy: 'public' | 'private';
  enable_ai_insights: boolean;
  prompt_suggestions: boolean;
}
