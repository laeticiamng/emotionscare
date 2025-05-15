import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from 'react-query';
import { fetchEmotionsHistory } from '@/lib/scanService';
import { EmotionResult } from '@/types';
import { getEmotionIcon } from '@/lib/emotionUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryTabContentProps {
  userId?: string;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ userId }) => {
  const { user } = useAuth();
  const currentUserId = userId || user?.id || '';
  
  const { data: emotions, isLoading, error } = useQuery(
    ['emotionsHistory', currentUserId],
    () => fetchEmotionsHistory(currentUserId),
    {
      enabled: !!currentUserId,
    }
  );
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          Chargement de l'historique...
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          Erreur lors du chargement de l'historique.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des émotions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {emotions && emotions.length > 0 ? (
              emotions.map((emotion: EmotionResult) => {
                const EmotionIcon = getEmotionIcon(emotion.emotion);
                const formattedDate = emotion.date
                  ? format(new Date(emotion.date), 'dd MMMM yyyy, HH:mm', { locale: fr })
                  : 'Date inconnue';
                
                return (
                  <div key={emotion.id} className="p-4 flex items-center space-x-4">
                    {EmotionIcon && <EmotionIcon className="h-6 w-6 text-gray-500" />}
                    <div>
                      <div className="text-sm font-medium">{emotion.emotion}</div>
                      <div className="text-xs text-muted-foreground">{formattedDate}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {emotion.feedback || "No AI feedback available"}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Aucune émotion enregistrée.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryTabContent;
