
export interface JournalEntry {
  id: string;
  date: string;
  title?: string; // Making title optional
  content: string;
  mood?: string | number;
  text?: string;
  ai_feedback?: string;
  tags?: string[];
  emotions?: string[];
  mood_score?: number;
}
