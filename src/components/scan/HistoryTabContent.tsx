
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEmotionHistory } from '@/lib/scanService';
import { Emotion } from '@/types';
import EmotionTrendChart from './EmotionTrendChart';
import EmotionHistory from './EmotionHistory';
import { Card } from '@/components/ui/card';

interface HistoryTabContentProps {
  userId: string;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ userId }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadEmotions = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchEmotionHistory(userId);
        setEmotions(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique des émotions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEmotions();
  }, [userId]);

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Connectez-vous pour voir votre historique émotionnel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EmotionTrendChart emotions={emotions} loading={isLoading} />
      
      <Card>
        <EmotionHistory 
          emotions={emotions} 
          isLoading={isLoading} 
        />
      </Card>
    </div>
  );
};

export default HistoryTabContent;
