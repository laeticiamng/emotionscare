
import React from 'react';
import { EmotionResult } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/index';

interface HistoryTabContentProps {
  emotionHistory: EmotionResult[];
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ emotionHistory }) => {
  if (emotionHistory.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucun historique disponible</p>
        <p className="text-sm text-muted-foreground mt-2">
          Réalisez votre premier scan pour commencer à suivre vos émotions
        </p>
      </div>
    );
  }
  
  const getEmotionEmoji = (emotion: string): string => {
    const emotionMap: Record<string, string> = {
      joy: '😊',
      sadness: '😢',
      anger: '😠',
      fear: '😨',
      disgust: '🤢',
      surprise: '😲',
      calm: '😌',
      neutral: '😐',
    };
    
    return emotionMap[emotion.toLowerCase()] || '🙂';
  };

  return (
    <div className="space-y-4">
      {emotionHistory.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="flex items-center justify-center bg-muted/60 p-4 text-4xl">
                {getEmotionEmoji(entry.emotion || '')}
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium capitalize">{entry.emotion}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.date ? formatDate(entry.date) : 'Date inconnue'}
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                    {entry.score ? `${Math.round(entry.score * 100)}%` : 'N/A'}
                  </div>
                </div>
                {entry.text && (
                  <p className="mt-2 text-sm">{entry.text}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HistoryTabContent;
