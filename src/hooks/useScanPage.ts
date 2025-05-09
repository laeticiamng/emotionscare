import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Emotion, UserRole } from '@/types';
import { getEmotions } from '@/lib/scan/emotionService';

interface UseScanPageHook {
  emotions: Emotion[];
  isLoading: boolean;
  error: string | null;
}

const useScanPage = (): UseScanPageHook => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmotions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user) {
          let emotionsData: Emotion[];
          if (user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN) {
            // Fetch all emotions for admin/manager
            emotionsData = await getEmotions();
          } else {
            // Fetch only the user's emotions
            emotionsData = await getEmotions(user.id);
          }
          setEmotions(emotionsData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch emotions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmotions();
  }, [user]);

  return { emotions, isLoading, error };
};

export default useScanPage;
