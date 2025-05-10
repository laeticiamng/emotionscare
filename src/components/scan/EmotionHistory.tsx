
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Emotion } from '@/types';

export interface EmotionHistoryProps {
  emotions: Emotion[];
  loading: boolean;
  error: string | null;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ emotions, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Une erreur est survenue: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (emotions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Aucune donnée d'émotion disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historique des émotions</h3>
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <div 
              key={emotion.id} 
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <div className="font-medium capitalize">{emotion.emotion}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(emotion.date).toLocaleDateString()}
                </div>
                {emotion.text && (
                  <p className="mt-1 text-sm">{emotion.text}</p>
                )}
              </div>
              <div className="flex items-center">
                <span 
                  className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-medium ${
                    emotion.score >= 70 ? 'bg-green-100 text-green-800' : 
                    emotion.score >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {emotion.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
