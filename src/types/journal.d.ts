
export interface JournalEntry {
  id: string;
  date: string;
  title?: string; // Make this optional to match the other definition
  content: string;
  mood?: string | number;
  text?: string;
  ai_feedback?: string;
  tags?: string[];
  emotions?: string[];
  mood_score?: number;
}
