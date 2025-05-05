import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getUserEmotions } from '@/lib/scanService';
import LoadingAnimation from '@/components/ui/loading-animation';

interface EmotionHistoryProps {
  userId?: string; // Make userId optional to match usage in ScanPage
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ userId }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmotions = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userEmotions = await getUserEmotions(userId);
        setEmotions(userEmotions);
      } catch (error) {
        console.error('Error fetching emotion history:', error);
        toast({
          title: 'Erreur',
          description: "Impossible de charger l'historique des émotions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, [userId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingAnimation text="Chargement de l'historique..." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Historique des Scans Émotionnels</h3>
      </CardHeader>
      <CardContent className="p-4">
        {emotions.length === 0 ? (
          <p className="text-muted-foreground">Aucun scan émotionnel enregistré.</p>
        ) : (
          <div className="space-y-3">
            {emotions.map((emotion) => (
              <div key={emotion.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{emotion.date}</span>
                  <span className="text-sm text-gray-500">Score: {emotion.score}</span>
                </div>
                <Separator className="my-2" />
                <p className="text-sm">{emotion.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
