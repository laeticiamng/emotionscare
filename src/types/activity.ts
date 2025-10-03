
// Types liés aux activités
export type ActivityTabView = 'daily' | 'stats' | 'all' | 'sessions' | 'emotions' | 'interactions' | 'achievements';

export interface ActivityFiltersState {
  searchTerm?: string;
  activityType?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  type?: ActivityTabView;
  userId?: string;
  teamId?: string;
}

export interface AnonymousActivity {
  id: string;
  activity_type?: string;
  type?: string;
  category?: string;
  count?: number;
  timestamp_day?: string;
  date?: string;
  description?: string;
  action?: string;
  actionUrl?: string;
  icon?: string;
  details?: Record<string, any>;
}

export interface ActivityStats {
  activity_type?: string;
  total_count?: number;
  percentage?: number;
  totalActivities?: number;
  sessionsCount?: number;
  emotionsCount?: number;
  interactionsCount?: number;
  achievementsCount?: number;
  mostActiveDay?: string;
  lastActivityDate?: string;
}
