
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/lib/activity/activityLogService';

/**
 * Hook for recording user activity
 * @param pageOrFeature - The page or feature being accessed
 * @param details - Additional details about the activity
 */
export function useActivityLogging(
  pageOrFeature: string, 
  details: Record<string, any> = {}
) {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const activityType = `visit_${pageOrFeature}`;
      logActivity(user.id, activityType, {
        ...details,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`Activity logged: ${activityType} for user ${user.id}`);
    }
  }, [user?.id, isAuthenticated, pageOrFeature, details]);
  
  const logUserAction = (action: string, actionDetails: Record<string, any> = {}) => {
    if (isAuthenticated && user?.id) {
      const activityType = `${pageOrFeature}_${action}`;
      logActivity(user.id, activityType, {
        ...actionDetails,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`User action logged: ${activityType} for user ${user.id}`);
    }
  };
  
  return { logUserAction };
}
