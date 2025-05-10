
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  emotion?: string;
  mood_score?: number;
  created_at: string | Date;
  updated_at?: string | Date;
  tags?: string[];
  is_private?: boolean;
  location?: string;
  weather?: string;
  visibility?: 'private' | 'public' | 'friends';
  media_urls?: string[];
}
