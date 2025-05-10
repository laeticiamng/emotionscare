
import { useState, useEffect, useCallback } from 'react';
import { Emotion } from '@/types';
import { fetchEmotionHistory } from '@/lib/scanService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export function useScanPage() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshEmotions = useCallback(async () => {
    if (!user?.id) {
      console.warn("Attempting to refresh emotions without a user ID");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching emotion history for user:", user.id);
      const history = await fetchEmotionHistory(user.id);
      console.log("Fetched emotions:", history.length);
      setEmotions(history);
      
      return history;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue lors du chargement de votre historique émotionnel";
      setError(message);
      console.error("Error refreshing emotions:", err);
      
      toast({
        title: "Erreur de chargement",
        description: message,
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);
  
  // Charger l'historique d'émotions au montage
  useEffect(() => {
    if (user?.id) {
      refreshEmotions();
    }
  }, [user?.id, refreshEmotions]);

  return {
    emotions,
    isLoading,
    error,
    refreshEmotions
  };
}

export default useScanPage;
