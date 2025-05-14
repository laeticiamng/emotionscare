
import { useState, useEffect } from 'react';

// Define the coach hook interface
interface CoachHook {
  lastEmotion?: string;
  recommendations?: string[];
  isLoading: boolean;
}

/**
 * Hook for accessing coach data and recommendations
 * based on user's emotional state
 */
export const useCoach = (): CoachHook => {
  const [lastEmotion, setLastEmotion] = useState<string | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Here you would load the user's last emotion from the database
    // or from a context if that data is already available
    
    // Mock implementation
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setLastEmotion('calm');
      setRecommendations([
        'Pratiquer la respiration profonde pendant 5 minutes',
        'Écouter une musique apaisante',
        'Faire une courte méditation guidée',
      ]);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    lastEmotion,
    recommendations,
    isLoading
  };
};

export default useCoach;
