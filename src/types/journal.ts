
// Create a file for journal types
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  mood: string;
  mood_score: number;
  emotions: string[];
  created_at: string | Date;
  updated_at: string | Date;
  tags?: string[];
  is_private?: boolean;
  weather?: string;
  location?: string;
  title?: string;
  media_urls?: string[];
  image_url?: string;
}

export interface JournalStatistics {
  total: number;
  this_week: number;
  this_month: number;
  average_mood: number;
  mood_trend: 'up' | 'down' | 'stable';
  top_emotions: string[];
  streak_days: number;
}

export interface JournalFilter {
  startDate?: Date;
  endDate?: Date;
  mood?: string[];
  emotions?: string[];
  tags?: string[];
  search?: string;
}
