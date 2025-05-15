
export interface MoodData {
  id?: string;
  date: string;
  originalDate?: string;
  value: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  mood?: string;
}

export interface MoodTrend {
  period: string;
  average: number;
  change: number;
  changePercent: number;
}

export interface MoodInsight {
  title: string;
  description: string;
  type: 'improvement' | 'decline' | 'neutral' | 'insight';
  score?: number;
  trigger?: string;
  actionable?: boolean;
  recommendation?: string;
}

export interface MoodStatistics {
  average: number;
  highest: number;
  lowest: number;
  trends: MoodTrend[];
  insights: MoodInsight[];
  completionRate: number;
}
