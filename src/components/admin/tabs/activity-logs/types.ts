
// Activity logs types
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

export type ActivityTabView = 'daily' | 'stats';

export interface ActivityFiltersState {
  searchTerm: string;
  activityType: string;
  startDate?: Date;
  endDate?: Date;
}
