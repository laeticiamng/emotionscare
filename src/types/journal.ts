
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: number;
  emotion?: string;
  created_at: string | Date;
  updated_at?: string | Date;
  tags?: string[];
  is_favorite?: boolean;
  is_private?: boolean;
  location?: string;
  weather?: string;
  analysis?: JournalAnalysis;
}

export interface JournalAnalysis {
  sentiment: number;
  topics: string[];
  keywords: string[];
  emotions: {
    name: string;
    score: number;
  }[];
  summary?: string;
  suggestions?: string[];
}
