
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  mood_score?: number;
  tags?: string[];
  created_at: string | Date;
  updated_at: string | Date;
  is_private: boolean;
  date?: string | Date; 
  text?: string;
  ai_feedback?: string;
}
