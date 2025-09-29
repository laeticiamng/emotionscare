
export interface JournalEntry {
  id: string;
  user_id?: string;
  date: string | Date;
  content: string;
  title?: string;
  mood?: string;
  tags?: string[];
  ai_feedback?: string;
  emotion?: string;
  intensity?: number;
  sentiment_score?: number;
  private?: boolean;
}
