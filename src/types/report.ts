
export interface Report {
  id: string;
  date: string | Date;
  created_at: string | Date;
  title: string;
  type: string;
  period: string;
  data: Record<string, any>;
  metrics: {
    name: string;
    value: number;
    change: number;
  }[];
  description: string;
  user_id: string;
  summary: string;
  mood_score?: number;
  categories?: string[];
  recommendations?: string[];
  metric?: string;
  period_start?: string | Date;
  period_end?: string | Date;
  value?: number;
  change_pct?: number;
}
