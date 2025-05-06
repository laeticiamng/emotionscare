
// Activity type definitions
export interface ActivityLogEntry {
  id: string;
  userId: string;
  activityType: string;
  timestamp: string;
  details: Record<string, any>;
}

export type ActivityType = 
  | 'login'
  | 'scan_emotion'
  | 'journal_entry'
  | 'vr_session'
  | 'profile_update'
  | 'consultation'
  | 'event_registration'
  | 'questionnaire_response';

export interface ActivityLogOptions {
  silent?: boolean;
}
