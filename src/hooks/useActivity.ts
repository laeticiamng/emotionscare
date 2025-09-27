
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface UseActivityOptions {
  anonymize?: boolean;
}

export function useActivity(options: UseActivityOptions = {}) {
  const { anonymize = false } = options;
  const { user } = useAuth();

  const logActivity = useCallback((
    activityType: string,
    details: Record<string, any> = {}
  ) => {
    // Only proceed if user is logged in
    if (!user) return;

    const activityData = {
      user_id: anonymize ? 'anonymous' : user.id,
      activity_type: activityType,
      timestamp: new Date().toISOString(),
      activity_details: details
    };

    // In a real app, this would send to an API or analytics service
    console.log('Activity logged:', activityData);
    
    // You could implement actual API calls here
    // Example: api.post('/activity-logs', activityData);
  }, [user, anonymize]);

  return {
    logActivity
  };
}
