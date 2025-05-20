
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface HistoryTabContentProps {
  emotionHistory: EmotionResult[];
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ emotionHistory }) => {
  if (emotionHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun historique d'émotions disponible.</p>
      </div>
    );
  }

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-100 text-yellow-800',
      calm: 'bg-blue-100 text-blue-800',
      anxiety: 'bg-orange-100 text-orange-800',
      sadness: 'bg-indigo-100 text-indigo-800',
      anger: 'bg-red-100 text-red-800',
      fear: 'bg-purple-100 text-purple-800',
      surprise: 'bg-green-100 text-green-800',
      disgust: 'bg-teal-100 text-teal-800',
      neutral: 'bg-gray-100 text-gray-800',
    };
    
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      return 'date inconnue';
    }
  };

  return (
    <div className="space-y-4">
      {emotionHistory.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEmotionColor(item.emotion)}`}>
                  {item.emotion}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.source && `via ${item.source}`}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.date || item.timestamp || '')}
              </span>
            </div>
            
            {item.text && (
              <p className="mt-2 text-sm">
                {item.text}
              </p>
            )}
            
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span className="font-medium">
                Intensité: {Math.round((item.intensity || item.confidence) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HistoryTabContent;
