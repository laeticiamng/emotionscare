import { useCallback } from 'react';

interface ActivityLogData {
  userId?: string;
  action: string;
  details?: Record<string, any>;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export const useActivityLogger = () => {
  const logActivity = useCallback(async (data: ActivityLogData) => {
    try {
      const logEntry = {
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
        userId: data.userId || 'anonymous',
      };

      // In development, just log to console
      console.log('🔍 Activity Log:', logEntry);

      // In production, this would send to your analytics service
      // await fetch('/api/activity-log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });

      return { success: true };
    } catch (error) {
      console.error('Failed to log activity:', error);
      return { success: false, error };
    }
  }, []);

  const logEmotionScan = useCallback(async (emotion: string, confidence?: number) => {
    return logActivity({
      action: 'emotion_scan_completed',
      details: { emotion, confidence },
      metadata: { feature: 'emotion_scanner' }
    });
  }, [logActivity]);

  const logGritChallenge = useCallback(async (challengeType: string, result?: string) => {
    return logActivity({
      action: 'grit_challenge_attempted',
      details: { challengeType, result },
      metadata: { feature: 'boss_level_grit' }
    });
  }, [logActivity]);

  const logPageView = useCallback(async (pageName: string) => {
    return logActivity({
      action: 'page_viewed',
      details: { pageName },
      metadata: { type: 'navigation' }
    });
  }, [logActivity]);

  return {
    logActivity,
    logEmotionScan,
    logGritChallenge,
    logPageView,
  };
};

export default useActivityLogger;