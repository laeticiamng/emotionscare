
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type ActivityType = 
  | 'visit_page' 
  | 'scan_emotion' 
  | 'use_coach' 
  | 'play_music' 
  | 'visit_coach_chat_page'
  | 'coach_interaction'
  | string;

interface ActivityData {
  [key: string]: any;
}

export function useActivity() {
  const { user } = useAuth();
  
  const logActivity = useCallback(async (
    activityType: ActivityType, 
    data: ActivityData = {}
  ) => {
    if (!user?.id) return;
    
    try {
      const activity = {
        user_id: user.id,
        activity_type: activityType,
        timestamp: new Date().toISOString(),
        data
      };
      
      // Log to console for development
      console.log('Activity logged:', activity);
      
      // If we have a user_activity table in the database, log to it
      try {
        const { error } = await supabase
          .from('user_activity')
          .insert(activity);
          
        if (error) {
          console.error('Error logging activity to database:', error);
        }
      } catch (dbError) {
        // If the table doesn't exist, just log to console
        console.log('Activity logging to database skipped:', dbError);
      }
      
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }, [user]);

  return { logActivity };
}
