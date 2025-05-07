
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
      
      // Instead of trying to insert into a non-existent table,
      // we'll call the existing activity logging service
      try {
        // Import and use the activityLogService
        const { logActivity: logActivityService } = await import('@/lib/activity/activityLogService');
        if (logActivityService) {
          logActivityService(user.id, activityType, data);
        }
      } catch (serviceError) {
        console.log('Activity logging to service skipped:', serviceError);
      }
      
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }, [user]);

  return { logActivity };
}
