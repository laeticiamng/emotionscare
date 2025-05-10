
// Add or update this file
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  ai_feedback?: string;
  emotions?: string[];
  updated_at?: string | Date;
  title?: string;
  mood?: string;
  mood_score?: number;
  created_at?: string;
  text?: string; // Some components use text instead of content
}
