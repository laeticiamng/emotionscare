
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserContext } from '@/types/chat';

interface UseUserContextReturn {
  userContext: UserContext;
  loading: boolean;
}

const useUserContext = (): UseUserContextReturn => {
  const { user } = useAuth();
  const [userContext, setUserContext] = useState<UserContext>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserContext = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          // Mock data for now, in a real app this would come from an API
          setUserContext({
            preferences: user.preferences || {},
            recentEmotions: ['calm', 'happy', 'focused'],
            recentActivities: ['meditation', 'journaling', 'breathing exercise'],
            userHistory: {
              lastInteraction: new Date().toISOString(),
              frequentTopics: ['stress', 'sleep', 'productivity'],
            }
          });
        } else {
          setUserContext({});
        }
      } catch (error) {
        console.error('Error fetching user context:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserContext();
  }, [user]);

  return {
    userContext,
    loading,
  };
};

export default useUserContext;
