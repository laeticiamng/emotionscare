
export interface MoodData {
  date: string;
  score: number;
  emotion?: string;
  label?: string;
}

export interface MoodStats {
  avgScore: number;
  trend: 'up' | 'down' | 'stable';
  deltaPercent: number;
}
