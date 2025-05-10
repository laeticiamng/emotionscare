
import React, { useMemo } from 'react';
import { Emotion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ClockIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmotionHistoryProps {
  emotions: Emotion[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ 
  emotions, 
  isLoading = false, 
  error = null,
  onRefresh 
}) => {
  // Fonction pour mapper un score à un emoji
  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: {[key: string]: string} = {
      'joy': '😊',
      'happy': '😊',
      'sadness': '😔',
      'sad': '😔',
      'anger': '😡',
      'angry': '😡',
      'fear': '😨',
      'anxious': '😰',
      'surprise': '😲',
      'disgust': '🤢',
      'neutral': '😐',
      'calm': '😌',
      'relaxed': '☺️',
      'stressed': '😫',
      'excited': '😃',
    };

    return emojiMap[emotion.toLowerCase()] || '❓';
  };

  // Afficher un maximum de 10 entrées dans l'historique
  const displayEmotions = useMemo(() => {
    return emotions.slice(0, 10);
  }, [emotions]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Historique des scans</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Historique des scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">Erreur: {error}</p>
            <p className="text-muted-foreground mb-6">Impossible de charger l'historique des émotions.</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (emotions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Historique des scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-6">Aucune émotion enregistrée. Complétez un scan pour commencer à voir votre historique.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string | Date) => {
    try {
      const date = typeof dateStr === 'string' || dateStr instanceof Date ? new Date(dateStr) : new Date();
      return format(date, 'PPP', { locale: fr });
    } catch (e) {
      return "Date invalide";
    }
  };

  const formatTime = (dateStr: string | Date) => {
    try {
      const date = typeof dateStr === 'string' || dateStr instanceof Date ? new Date(dateStr) : new Date();
      return format(date, 'HH:mm', { locale: fr });
    } catch (e) {
      return "--:--";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Historique des scans</CardTitle>
        {onRefresh && (
          <Button onClick={onRefresh} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 divide-y">
          {displayEmotions.map((emotion) => (
            <li key={emotion.id || `${emotion.date}-${emotion.emotion}`} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getEmotionEmoji(emotion.emotion)}</div>
                  <div>
                    <p className="font-medium">{emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}</p>
                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(emotion.date || new Date())}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatTime(emotion.date || new Date())}
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
              {emotion.ai_feedback && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  <strong>Feedback IA:</strong> {emotion.ai_feedback}
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
