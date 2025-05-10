
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
  emotion?: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface JournalFilter {
  tag?: string;
  emotion?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface JournalStats {
  totalEntries: number;
  avgMood: number;
  topEmotion?: string;
  mostUsedTag?: string;
  streakDays: number;
}
