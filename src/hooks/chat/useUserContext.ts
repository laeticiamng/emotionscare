import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserContext } from '@/types/chat';

interface UseUserContextResult {
  userContext: UserContext | null;
  isLoading: boolean;
  error: string | null;
}

const useUserContext = (): UseUserContextResult => {
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserContext = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate fetching user context from an API
        // Replace this with your actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock user context data
        const mockUserContext: UserContext = {
          preferences: {
            theme: 'light',
            notifications_enabled: true,
          },
          recentEmotions: ['happy', 'calm'],
          recentActivities: ['meditation', 'journaling'],
          userHistory: {
            moodTrends: 'positive',
            activityLevels: 'moderate',
          },
        };

        setUserContext(mockUserContext);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user context');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserContext();
    } else {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [user]);

  return {
    userContext,
    isLoading,
    error,
  };
};

export default useUserContext;
