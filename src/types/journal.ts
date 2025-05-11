
export interface JournalEntry {
  id: string;
  user_id?: string;
  date: Date | string;
  content: string;
  mood?: number;
  tags?: string[];
  title?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  ai_feedback?: string;
  created_at?: string;
}

export interface MoodFilter {
  from?: Date;
  to?: Date;
  minMood?: number;
  maxMood?: number;
  tags?: string[];
}

export interface MoodStats {
  average: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  periods: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}
