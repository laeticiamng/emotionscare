
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  title: string;
  content: string;
  emotion?: string;
  emotion_score?: number;
  mood?: string;
  mood_score?: number;
  tags?: string[];
  images?: string[];
  is_favorite?: boolean;
  is_private?: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}
