
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
  date?: string | Date; // Added date property
  text?: string; // Added text property
  ai_feedback?: string; // Added ai_feedback property
}
