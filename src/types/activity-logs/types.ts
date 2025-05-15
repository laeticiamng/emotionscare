
export type ActivityTabView = 'all' | 'sessions' | 'emotions' | 'interactions' | 'achievements';

export interface ActivityFiltersState {
  startDate?: string;
  endDate?: string;
  type?: ActivityTabView;
  userId?: string;
  teamId?: string;
  searchTerm?: string;
}

export interface AnonymousActivity {
  id: string;
  type: string;
  date: string;
  description: string;
  action?: string;
  actionUrl?: string;
  icon?: string;
  details?: Record<string, any>;
}

export interface ActivityStats {
  totalActivities: number;
  sessionsCount: number;
  emotionsCount: number;
  interactionsCount: number;
  achievementsCount: number;
  mostActiveDay?: string;
  lastActivityDate?: string;
}
