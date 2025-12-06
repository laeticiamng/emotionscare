// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

interface EmotionalClimateCardProps {
  emotionalScoreTrend: DataPoint[];
}

const EmotionalClimateCard: React.FC<EmotionalClimateCardProps> = ({
  emotionalScoreTrend
}) => {
  // Calculate the average score
  const averageScore = emotionalScoreTrend.reduce((sum, point) => sum + point.value, 0) / emotionalScoreTrend.length;
  
  // Get the latest score
  const latestScore = emotionalScoreTrend[emotionalScoreTrend.length - 1]?.value || 0;
  
  // Calculate the change from the first to last datapoint
  const firstScore = emotionalScoreTrend[0]?.value || 0;
  const scoreChange = latestScore - firstScore;
  const changeDirection = scoreChange >= 0 ? 'up' : 'down';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-destructive" />
          Climat émotionnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Score moyen</div>
            <div className="text-3xl font-bold mt-1">{averageScore.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">sur 100</div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Tendance</div>
            <div className={`text-3xl font-bold mt-1 ${
              changeDirection === 'up' ? 'text-success' : 'text-destructive'
            }`}>
              {changeDirection === 'up' ? '↑' : '↓'} {Math.abs(scoreChange).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">sur 7 jours</div>
          </div>
        </div>
        
        <div className="h-48 bg-muted/20 rounded-md flex items-center justify-center">
          Graphique de tendance émotionnelle
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalClimateCard;
