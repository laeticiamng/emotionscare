
import { ActivityLogData } from './activityTypes';
import { supabase } from '@/lib/supabase-client';

/**
 * Log an activity to the database
 * @param activityData The activity data to log
 * @returns Promise with the created activity or error
 */
export const logActivity = async (activityData: ActivityLogData): Promise<void> => {
  try {
    console.log("Logging activity:", activityData);
    
    // In a real implementation, we would save this to the database
    // const { data, error } = await supabase
    //   .from('user_activity_logs')
    //   .insert({
    //     user_id: activityData.user_id,
    //     activity_type: activityData.activity_type,
    //     activity_details: activityData.activity_details,
    //     user_ip: activityData.user_ip
    //   });
    
    // if (error) throw error;
    
    // For now, just log it to console
    console.log("Activity logged successfully (mock)");
    return Promise.resolve();
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

/**
 * Get activities for a specific user
 * @param userId The user ID to get activities for
 * @param limit The maximum number of activities to return
 * @returns Promise with the user's activities
 */
export const getUserActivities = async (userId: string, limit: number = 10): Promise<any[]> => {
  try {
    // In a real implementation, we would fetch this from the database
    // const { data, error } = await supabase
    //   .from('user_activity_logs')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('timestamp', { ascending: false })
    //   .limit(limit);
    
    // if (error) throw error;
    
    // For now, return mock data
    return Promise.resolve([
      {
        id: '1',
        user_id: userId,
        activity_type: 'login',
        timestamp: new Date().toISOString(),
        activity_details: { device: 'web browser' }
      },
      {
        id: '2',
        user_id: userId,
        activity_type: 'emotion_scan',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        activity_details: { score: 85 }
      }
    ]);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return [];
  }
};
