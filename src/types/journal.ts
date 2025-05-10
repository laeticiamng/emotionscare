
// Types for journal-related components
export * from './index';

export interface JournalFilter {
  dateRange?: [Date | null, Date | null];
  emotions?: string[];
  tags?: string[];
  searchText?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  mood?: string;
  mood_intensity?: number;
  tags?: string[];
  is_locked?: boolean;
  emotion_analysis?: Record<string, number>;
  is_favorite?: boolean;
}
