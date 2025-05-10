
export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  text?: string;
  date: string | Date;
  emotion?: string;
  intensity?: number;
  tags?: string[];
  is_private?: boolean;
  ai_feedback?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface JournalStats {
  total_entries: number;
  days_streak: number;
  most_common_emotion: string;
  emotion_distribution: Record<string, number>;
  weekly_entries: number[];
}

export interface JournalFilter {
  startDate?: Date;
  endDate?: Date;
  emotion?: string;
  tags?: string[];
  searchText?: string;
}
