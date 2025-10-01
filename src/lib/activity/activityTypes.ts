// @ts-nocheck

/**
 * Activity types for tracking user actions
 */
export type ActivityType =
  | 'visit_page'
  | 'scan_emotion'
  | 'use_coach'
  | 'play_music'
  | 'visit_coach_chat_page'
  | 'coach_interaction'
  | string;

/**
 * Structure of an activity log entry
 */
export interface ActivityLog {
  id?: string;
  user_id: string;
  activity_type: string;
  timestamp: string;
  activity_details?: Record<string, any>;
}

/**
 * Anonymized activity log structure for reporting
 */
export interface AnonymizedActivityLog {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

/**
 * Activity statistics for aggregated reporting
 */
export interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}
