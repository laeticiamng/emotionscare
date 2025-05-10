
import { useCallback } from 'react';

type ActivityCategory = 'music' | 'journal' | 'meditation' | 'scan' | 'chat' | 'general';
type ActivityAction = string;

/**
 * Hook for logging user activities throughout the app
 */
export function useActivityLogging(category: ActivityCategory = 'general') {
  /**
   * Log a user action for analytics or activity tracking
   */
  const logUserAction = useCallback((action: ActivityAction, details?: Record<string, any>) => {
    // In a real app, this would send to an analytics service or backend
    console.log(`[Activity Log] ${category}:${action}`, details || {});
    
    // Example implementation if you had a backend:
    // try {
    //   fetch('/api/activity-log', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       category, 
    //       action, 
    //       timestamp: new Date().toISOString(),
    //       details 
    //     })
    //   });
    // } catch (error) {
    //   console.error('Failed to log activity:', error);
    // }
  }, [category]);

  return {
    logUserAction
  };
}
