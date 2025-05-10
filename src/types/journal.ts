
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title?: string;
  content: string;
  mood?: string;
  emotion?: string;
  tags?: string[];
  images?: string[];
  is_private?: boolean;
  ai_feedback?: string;
  location?: string;
  weather?: string;
  highlights?: string[];
  featured_quote?: string;
  word_count?: number;
  activity_level?: number;
  sleep_hours?: number;
  gratitude_items?: string[];
  insights?: string[];
  
  // Champs supplémentaires pour la compatibilité
  created_at?: string | Date;
  mood_score?: number;
  text?: string; // Pour la compatibilité avec JournalCalendarView et JournalListView
}
