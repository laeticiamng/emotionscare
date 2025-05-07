
export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  timestamp: Date;
  details: Record<string, any>;
}

export interface ActivitySummary {
  activity_type: string;
  count: number;
  category?: string;
}

export interface DailyActivity {
  date: string;
  count: number;
  activity_type: string;
}

export interface AnonymizedActivityLog {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

export interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}
