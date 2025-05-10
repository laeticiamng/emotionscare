
export interface MoodData {
  id?: string;
  userId?: string;
  date: string;
  value: number;
  label?: string;
  notes?: string;
  tags?: string[];
  emotion?: string;
}

export interface MoodStats {
  average: number;
  highest: MoodData;
  lowest: MoodData;
  trend: 'improving' | 'declining' | 'stable';
  weeklyAverage: number[];
}
