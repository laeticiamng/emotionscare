
// Journal related types

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  title: string;
  mood: string;
  created_at: string;
  ai_feedback?: string;
  text?: string;
  mood_score: number;
}

export interface JournalEntryFormData {
  title: string;
  content: string;
  mood: string;
  ai_analysis?: boolean;
}

export interface JournalFilterOptions {
  period: 'all' | 'month' | 'week';
  mood?: string;
}
