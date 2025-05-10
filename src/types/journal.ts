
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string | Date;
  updated_at?: string | Date;
  labels?: string[];
  emotion?: string;
  emotion_score?: number;
  ai_feedback?: string;
  date?: string | Date; // Add this property
  text?: string; // Add this property
}

export interface JournalStats {
  total: number;
  this_week: number;
  this_month: number;
  streak_days: number;
  emotions: {
    name: string;
    count: number;
  }[];
}

export interface JournalFilter {
  period?: 'day' | 'week' | 'month' | 'year';
  emotion?: string;
  label?: string;
  search?: string;
}
