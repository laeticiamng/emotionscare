
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface EmotionHistoryProps {
  emotions: EmotionResult[];
  onSelect?: (emotion: EmotionResult) => void;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ emotions, onSelect }) => {
  if (!emotions || emotions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des émotions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune émotion enregistrée pour l'instant.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSelect = (emotion: EmotionResult) => {
    if (onSelect) {
      onSelect(emotion);
    }
  };

  // Get emotion color based on the emotion name
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-100 text-yellow-800',
      happy: 'bg-yellow-100 text-yellow-800',
      calm: 'bg-blue-100 text-blue-800',
      relaxed: 'bg-blue-100 text-blue-800',
      sad: 'bg-indigo-100 text-indigo-800',
      depressed: 'bg-indigo-100 text-indigo-800',
      anxious: 'bg-purple-100 text-purple-800',
      stressed: 'bg-purple-100 text-purple-800',
      angry: 'bg-red-100 text-red-800',
      frustrated: 'bg-red-100 text-red-800',
      excited: 'bg-amber-100 text-amber-800',
      motivated: 'bg-green-100 text-green-800',
      focused: 'bg-cyan-100 text-cyan-800',
      bored: 'bg-gray-100 text-gray-800',
      tired: 'bg-gray-100 text-gray-800',
    };

    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des émotions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {emotions.map((emotion) => (
            <div
              key={emotion.id || emotion.timestamp}
              className="p-4 hover:bg-muted/50 cursor-pointer"
              onClick={() => handleSelect(emotion)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getEmotionColor(emotion.emotion)}`}>
                    {emotion.emotion}
                  </span>
                  {emotion.intensity && (
                    <span className="text-xs text-muted-foreground">
                      Intensité: {Math.round(emotion.intensity * 100)}%
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {emotion.timestamp && formatDistanceToNow(new Date(emotion.timestamp), { addSuffix: true })}
                </span>
              </div>
              {emotion.text && <p className="text-sm line-clamp-2">{emotion.text}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
