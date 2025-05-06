
import { supabase } from '@/lib/supabase-client';

export type ActivityType = 
  | 'connexion'
  | 'consultation'
  | 'inscription_event'
  | 'modification_profil'
  | 'questionnaire_reponse';

interface ActivityLogData {
  user_id: string;
  activity_type: ActivityType;
  activity_details?: Record<string, any>;
  user_ip?: string;
}

/**
 * Service for logging user activities
 */
export const activityLogService = {
  /**
   * Log a user activity
   * @param data Activity data to log
   */
  async logActivity(data: ActivityLogData): Promise<void> {
    try {
      const { user_id, activity_type, activity_details, user_ip } = data;
      
      const { error } = await supabase.from('user_activity_logs').insert({
        user_id,
        activity_type,
        activity_details,
        user_ip,
        timestamp: new Date().toISOString()
      });
      
      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  },
  
  /**
   * Log a user login
   * @param userId User ID
   * @param ip User IP address (optional)
   */
  async logLogin(userId: string, ip?: string): Promise<void> {
    return this.logActivity({
      user_id: userId,
      activity_type: 'connexion',
      user_ip: ip
    });
  },
  
  /**
   * Log content consultation
   * @param userId User ID
   * @param content Details about the content being consulted
   */
  async logConsultation(userId: string, content: { title: string; type?: string; id?: string }): Promise<void> {
    return this.logActivity({
      user_id: userId,
      activity_type: 'consultation',
      activity_details: {
        description: `A consulté "${content.title}"`,
        ...content
      }
    });
  },
  
  /**
   * Log event registration
   * @param userId User ID
   * @param event Details about the event
   */
  async logEventRegistration(userId: string, event: { title: string; date?: string; id?: string }): Promise<void> {
    return this.logActivity({
      user_id: userId,
      activity_type: 'inscription_event',
      activity_details: {
        description: `S'est inscrit à "${event.title}"`,
        ...event
      }
    });
  },
  
  /**
   * Log profile update
   * @param userId User ID
   * @param details Details about the update
   */
  async logProfileUpdate(userId: string, details?: Record<string, any>): Promise<void> {
    return this.logActivity({
      user_id: userId,
      activity_type: 'modification_profil',
      activity_details: {
        description: 'A mis à jour son profil',
        ...details
      }
    });
  },
  
  /**
   * Log questionnaire response
   * @param userId User ID
   * @param questionnaire Details about the questionnaire
   */
  async logQuestionnaireResponse(userId: string, questionnaire: { title: string; id?: string }): Promise<void> {
    return this.logActivity({
      user_id: userId,
      activity_type: 'questionnaire_reponse',
      activity_details: {
        description: `A complété "${questionnaire.title}"`,
        ...questionnaire
      }
    });
  }
};
