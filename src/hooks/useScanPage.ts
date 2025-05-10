
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getEmotions } from '@/lib/scanService';
import { Emotion } from '@/types';

export function useScanPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchEmotions = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getEmotions(user.id);
      setEmotions(data);
    } catch (err) {
      console.error('Error fetching emotions:', err);
      setError('Impossible de charger les données émotionnelles');
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données émotionnelles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmotions();
  }, [user?.id]);
  
  const refreshEmotions = async () => {
    await fetchEmotions();
    toast({
      title: "Données actualisées",
      description: "Vos données émotionnelles ont été mises à jour",
    });
  };
  
  return {
    emotions,
    loading,
    error,
    refreshEmotions
  };
}

export default useScanPage;
