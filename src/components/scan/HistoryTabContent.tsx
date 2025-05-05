
import React from 'react';
import { Card } from '@/components/ui/card';
import EmotionTrendChart from '@/components/scan/EmotionTrendChart';
import EmotionHistory from '@/components/scan/EmotionHistory';
import { Emotion } from '@/types';

interface HistoryTabContentProps {
  emotions: Emotion[];
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ emotions }) => {
  return (
    <div className="space-y-8">
      <Card className="p-6 shadow-md rounded-3xl">
        <h3 className="text-xl font-semibold mb-4">Évolution des émotions</h3>
        <EmotionTrendChart emotions={emotions} days={7} />

        {emotions.length > 0 && (
          <div className="mt-6 text-center p-4 bg-blue-50 rounded-2xl">
            <p className="font-medium text-blue-800">
              Votre humeur moyenne cette semaine : 
              <span className="ml-1 text-lg">
                {Math.round(emotions.slice(0, 7).reduce((acc, emotion) => acc + (emotion.score || 0), 0) / 
                  Math.min(emotions.length, 7))}% de bien-être
              </span>
            </p>
            {emotions.slice(0, 2).every(e => (e.score || 0) < 50) && (
              <p className="mt-2 text-sm text-blue-600">
                Suggestion : Complétez un mini-défi de respiration pour améliorer votre humeur
              </p>
            )}
          </div>
        )}
      </Card>

      <EmotionHistory />
    </div>
  );
};

export default HistoryTabContent;
