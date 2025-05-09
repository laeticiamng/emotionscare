
// Scan related types
import { Emotion, EmotionResult } from './emotion';
import { User } from './index';

export interface ScanSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  emotion_results?: EmotionResult[];
  text_input?: string;
  audio_file_url?: string;
  metadata?: Record<string, any>;
}

export interface EmotionScan {
  id: string;
  user_id: string;
  timestamp: string;
  emotion: string;
  confidence: number;
  feedback?: string;
  intensity?: number;
  input_type: 'text' | 'audio' | 'emoji' | 'image';
  input_content?: string;
  is_deleted?: boolean;
  is_favorite?: boolean;
  notes?: string;
  related_activity?: string;
  scan_duration_ms?: number;
}

export interface TeamEmotionData {
  team_id: string;
  team_name: string;
  average_score: number;
  member_count: number;
  emotion_distribution: Record<string, number>;
  trend: 'up' | 'down' | 'stable';
  trend_percentage: number;
  members?: User[];
  recent_changes?: Array<{
    date: string;
    score: number;
    change: number;
  }>;
}

export interface EmotionAlert {
  id: string;
  user_id: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  emotion: string;
  intensity: number;
  is_resolved: boolean;
  resolution_notes?: string;
  resolution_timestamp?: string;
  action_taken?: string;
  assigned_to?: string;
}
