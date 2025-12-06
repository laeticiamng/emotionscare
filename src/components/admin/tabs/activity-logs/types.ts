export type ActivityTabView = 'daily' | 'stats';

export interface ActivityFiltersState {
  searchTerm: string;
  activityType: string;
  startDate: string | Date;
  endDate: string | Date;
}

export interface AnonymousActivity {
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
