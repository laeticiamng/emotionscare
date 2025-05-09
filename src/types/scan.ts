
// Scan related types

export interface EmotionScan {
  id: string;
  user_id: string;
  text?: string;
  audio_url?: string;
  emojis?: string;
  created_at: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
  result?: any;
}

export interface EmotionScanRequest {
  userId: string;
  text?: string;
  audioUrl?: string;
  emojis?: string;
  isConfidential?: boolean;
  shareWithCoach?: boolean;
}

export interface EmotionScanSettings {
  enable_auto_scan?: boolean;
  scan_frequency?: 'daily' | 'twice_daily' | 'weekly';
  preferred_method?: 'text' | 'audio' | 'emoji';
  quick_scan_enabled?: boolean;
  confidential_by_default?: boolean;
  share_with_coach_by_default?: boolean;
}

export interface EmotionTrend {
  emotion: string;
  percentage: number;
  change: number;
  period: 'day' | 'week' | 'month';
}
