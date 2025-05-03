
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import type { Emotion } from '@/types/scan';

interface EmotionHistoryProps {
  history: Emotion[];
}

const EmotionHistory = ({ history }: EmotionHistoryProps) => {
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Votre historique</h2>
        <div className="space-y-4">
          {history.map(scan => (
            <Card key={scan.id} className="overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <div>
                  <div className="font-medium">
                    {new Date(scan.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {scan.text && <div className="text-sm text-gray-600 mt-1">{scan.text}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">{scan.score}/100</div>
                  <div className={`w-3 h-3 rounded-full ${getScoreColor(scan.score)}`}></div>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-200">
                <div 
                  className={`h-full ${getScoreColor(scan.score)}`}
                  style={{ width: `${scan.score}%` }}
                ></div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
