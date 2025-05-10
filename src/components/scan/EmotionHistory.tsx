
import React from 'react';
import { Emotion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface EmotionHistoryProps {
  emotions: Emotion[];
  isLoading?: boolean;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ emotions, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (emotions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Aucune émotion enregistrée. Complétez un scan pour commencer à voir votre historique.</p>
      </div>
    );
  }

  // Fonction pour mapper un score à un emoji
  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: {[key: string]: string} = {
      'joy': '😊',
      'sadness': '😔',
      'anger': '😡',
      'fear': '😨',
      'surprise': '😲',
      'disgust': '🤢',
      'neutral': '😐',
    };

    return emojiMap[emotion.toLowerCase()] || '❓';
  };

  // Afficher un maximum de 10 entrées dans l'historique
  const displayEmotions = emotions.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Historique des scans</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 divide-y">
          {displayEmotions.map((emotion) => (
            <li key={emotion.id} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getEmotionEmoji(emotion.emotion)}</div>
                  <div>
                    <p className="font-medium">{emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}</p>
                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(emotion.date || Date.now()), 'PPP', { locale: fr })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {format(new Date(emotion.date || Date.now()), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{emotion.score}/10</span>
                </div>
              </div>
              {emotion.text && (
                <div className="mt-2 text-sm border-l-2 border-muted pl-3 italic">
                  "{emotion.text}"
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
