// @ts-nocheck

import { useState, useEffect } from 'react';
import { UserContext } from '@/types/user-context';
import { logger } from '@/lib/logger';

export function useUserContext(userId?: string) {
  const [userContext, setUserContext] = useState<UserContext>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserContext = async () => {
      setIsLoading(true);
      
      try {
        // Simulate loading user context from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUserContext: UserContext = {
          id: userId || 'user-1',
          name: 'John Doe',
          preferences: {
            dailyReminders: true,
            notificationsEnabled: true
          },
          recentEmotions: ['stressed', 'calm', 'happy'],
          recentActivities: ['meditation', 'deep breathing', 'journaling'],
          userHistory: {
            lastInteraction: new Date(Date.now() - 86400000).toISOString(),
            frequentTopics: ['stress management', 'sleep', 'work-life balance']
          }
        };
        
        setUserContext(mockUserContext);
      } catch (error) {
        logger.error('Error loading user context', error as Error, 'UI');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadUserContext();
    }
  }, [userId]);

  return { userContext, isLoading };
}

export default useUserContext;
