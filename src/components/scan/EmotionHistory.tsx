
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Emotion } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionHistoryProps {
  emotions: Emotion[];
  loading: boolean;
  error: string | null;
  className?: string;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({
  emotions,
  loading,
  error,
  className
}) => {
  if (loading) {
    return (
      <Card className={`${className || ''}`}>
        <CardHeader>
          <CardTitle>Historique des scans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10">Chargement de votre historique...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className || ''}`}>
        <CardHeader>
          <CardTitle>Historique des scans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (emotions.length === 0) {
    return (
      <Card className={`${className || ''}`}>
        <CardHeader>
          <CardTitle>Historique des scans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10">Aucun scan n'a été enregistré pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className || ''}`}>
      <CardHeader>
        <CardTitle>Historique des scans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emotions.map((emotion) => {
            const date = emotion.date ? new Date(emotion.date) : new Date();
            
            return (
              <Card key={emotion.id} className="overflow-hidden">
                <div className={`h-2`} style={{ backgroundColor: emotion.color || '#888' }} />
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emotion.icon}</span>
                        <h3 className="font-semibold">{emotion.name}</h3>
                      </div>
                      {emotion.text && (
                        <p className="text-sm text-muted-foreground mt-2">"{emotion.text}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Score: {Math.round(emotion.score * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(date, "dd MMMM yyyy à HH:mm", { locale: fr })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
