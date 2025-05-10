
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getEmotionHistory } from '@/lib/scanService';
import { Emotion } from '@/types/emotion';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionHistoryProps {
  maxItems?: number;
  className?: string;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({
  maxItems = 5,
  className
}) => {
  const { user } = useAuth();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEmotions = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const history = await getEmotionHistory(user.id);
          setEmotions(history.slice(0, maxItems));
        } catch (error) {
          console.error('Failed to load emotion history:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadEmotions();
  }, [user?.id, maxItems]);
  
  const getEmotionColor = (emotion: string) => {
    switch(emotion?.toLowerCase()) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'calm': return 'bg-blue-100 text-blue-800';
      case 'sad': return 'bg-indigo-100 text-indigo-800';
      case 'angry': return 'bg-red-100 text-red-800';
      case 'stressed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Historique émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        ) : emotions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucun historique disponible.
          </p>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-4">
              {emotions.map((emotion) => (
                <div key={emotion.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(emotion.emotion || '')}`}>
                      {emotion.emotion || 'neutral'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(emotion.date || Date.now()), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  
                  {emotion.emojis && (
                    <div className="mt-2 text-xl">
                      {emotion.emojis}
                    </div>
                  )}
                  
                  {emotion.text && (
                    <p className="mt-2 text-sm">
                      {emotion.text.length > 100 ? `${emotion.text.substring(0, 100)}...` : emotion.text}
                    </p>
                  )}
                  
                  {emotion.ai_feedback && (
                    <p className="mt-2 text-xs italic text-muted-foreground">
                      {emotion.ai_feedback.length > 120 ? `${emotion.ai_feedback.substring(0, 120)}...` : emotion.ai_feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
