
export type ActivityTabView = 'list' | 'calendar' | 'stats';

export interface ActivityFiltersState {
  period: string;
  userIds?: string[];
  types?: string[];
  emotionRange?: [number, number];
  dateRange?: [Date, Date];
}

export interface AnonymousActivity {
  id: string;
  type: string;
  timestamp: string;
  emotion?: string;
  emotion_score?: number;
  duration?: number;
}

export interface ActivityStats {
  total: number;
  byType: Record<string, number>;
  byEmotion: Record<string, number>;
  byDay: Record<string, number>;
}
