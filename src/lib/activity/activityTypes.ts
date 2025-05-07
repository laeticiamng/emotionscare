
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
