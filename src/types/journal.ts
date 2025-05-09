
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
  difficulty?: 'easy' | 'medium' | 'deep';
  emotional_state?: string[];
  tags?: string[];
  is_favorite?: boolean;
  used_count?: number;
  created_at?: string;
}

export interface JournalStatistics {
  total_entries: number;
  streak_days: number;
  most_common_emotion: string;
  average_mood: number;
  total_words: number;
  most_active_day: string;
  entries_by_month: Record<string, number>;
  mood_evolution: Array<{
    date: string;
    mood: number;
  }>;
}

export interface JournalSettings {
  reminder_time?: string;
  reminder_enabled: boolean;
  default_privacy: 'private' | 'public';
  ai_analysis_enabled: boolean;
  export_format: 'pdf' | 'markdown' | 'txt';
  storage_limit_days?: number;
}
