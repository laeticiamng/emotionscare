
/**
 * Types of activities that can be logged
 */
export type ActivityType = 
  | 'connexion'
  | 'consultation'
  | 'inscription_event'
  | 'modification_profil'
  | 'questionnaire_reponse';

/**
 * Activity log data for creating a new activity log
 */
export interface ActivityLogData {
  user_id: string;
  activity_type: ActivityType;
  activity_details?: Record<string, any>;
  user_ip?: string;
}
