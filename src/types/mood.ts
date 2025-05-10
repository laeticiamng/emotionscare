
export interface MoodData {
  date: string | Date;
  value: number;
  emotion?: string;
  note?: string;
  id?: string;
  user_id?: string;
}

export interface MoodStats {
  average: number;
  highest: number;
  lowest: number;
  trend: 'up' | 'down' | 'stable';
  mostFrequentEmotion?: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  value: number;
  date: string | Date;
  emotion?: string;
  note?: string;
  created_at: string | Date;
}
