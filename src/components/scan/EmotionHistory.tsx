
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { getEmotionHistory } from '@/lib/scanService';

interface EmotionHistoryProps {
  userId?: string;
  limit?: number;
  showDetails?: boolean;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({
  userId = 'current-user',
  limit = 5,
  showDetails = true
}) => {
  const [history, setHistory] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getEmotionHistory(userId, limit);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching emotion history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [userId, limit]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-green-100 text-green-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      calm: 'bg-sky-100 text-sky-800',
      anxious: 'bg-amber-100 text-amber-800',
      neutral: 'bg-gray-100 text-gray-800',
      tired: 'bg-purple-100 text-purple-800',
      frustrated: 'bg-orange-100 text-orange-800',
      mixed: 'bg-indigo-100 text-indigo-800'
    };
    
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Chargement de l'historique...</p>
        ) : history.length === 0 ? (
          <p>Aucun historique disponible.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(item.emotion)}`}>
                      {item.emotion}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Score: {item.score}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                </div>
                
                {showDetails && item.text && (
                  <p className="text-sm">{item.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
