
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  user_id: string;
  mood?: number;
  emotion?: string;
  tags?: string[];
  is_private?: boolean;
  metadata?: {
    location?: string;
    weather?: string;
    activity?: string;
    [key: string]: any;
  };
}

export interface JournalTag {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export interface JournalStats {
  total: number;
  this_week: number;
  this_month: number;
  streak_days: number;
  most_used_tags: string[];
  most_common_emotion: string;
  average_mood: number;
}
