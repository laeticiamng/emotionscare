
import { supabase } from '@/lib/supabase-client';
import { AnonymousActivity, ActivityStats } from '@/components/dashboard/admin/tabs/activity-logs/types';

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

// Mock data for development
const mockActivities: AnonymousActivity[] = [
  {
    id: '1',
    activity_type: 'login',
    category: 'authentication',
    count: 25,
    timestamp_day: '2023-07-01'
  },
  {
    id: '2',
    activity_type: 'scan_emotion',
    category: 'wellness',
    count: 18,
    timestamp_day: '2023-07-01'
  },
  {
    id: '3',
    activity_type: 'journal_entry',
    category: 'wellness',
    count: 12,
    timestamp_day: '2023-07-02'
  },
  {
    id: '4',
    activity_type: 'vr_session',
    category: 'wellness',
    count: 8,
    timestamp_day: '2023-07-02'
  },
  {
    id: '5',
    activity_type: 'profile_update',
    category: 'account',
    count: 5,
    timestamp_day: '2023-07-03'
  }
];

const mockStats: ActivityStats[] = [
  {
    activity_type: 'login',
    total_count: 125,
    percentage: 40.5
  },
  {
    activity_type: 'scan_emotion',
    total_count: 82,
    percentage: 26.5
  },
  {
    activity_type: 'journal_entry',
    total_count: 45,
    percentage: 14.5
  },
  {
    activity_type: 'vr_session',
    total_count: 37,
    percentage: 12.0
  },
  {
    activity_type: 'profile_update',
    total_count: 20,
    percentage: 6.5
  }
];

/**
 * Get activity data
 */
export const getActivityData = async (): Promise<AnonymousActivity[]> => {
  try {
    // In a real implementation, we would fetch this from the database
    // const { data, error } = await supabase.rpc('get_anonymous_activity_logs');
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return Promise.resolve(mockActivities);
  } catch (error) {
    console.error("Error fetching activity data:", error);
    throw error;
  }
};

/**
 * Get activity statistics
 */
export const getActivityStats = async (): Promise<ActivityStats[]> => {
  try {
    // In a real implementation, we would fetch this from the database
    // const { data, error } = await supabase.rpc('get_activity_stats');
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return Promise.resolve(mockStats);
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    throw error;
  }
};

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
