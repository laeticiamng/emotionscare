
import React from 'react';
import { EmotionResult } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface LiveEmotionResultsProps {
  result: EmotionResult;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({ result }) => {
  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      happy: 'text-yellow-500',
      sad: 'text-blue-500',
      angry: 'text-red-500',
      anxious: 'text-purple-500',
      neutral: 'text-gray-500',
      calm: 'text-green-500'
    };
    
    return colorMap[emotion.toLowerCase()] || 'text-primary';
  };
  
  const confidencePercentage = Math.round((result.confidence || 0) * 100);
  
  return (
    <Card className="overflow-hidden border-none bg-accent/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
          <span className="text-sm text-muted-foreground">
            Confiance: {confidencePercentage}%
          </span>
        </div>
        
        <div className="mb-2">
          <Progress value={confidencePercentage} className="h-2" />
        </div>
        
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Émotion détectée:</span>
            <span className={`text-lg font-medium ${getEmotionColor(result.emotion)}`}>
              {result.emotion}
            </span>
          </div>
          
          {result.feedback && (
            <p className="mt-2 text-sm text-muted-foreground">
              {result.feedback}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEmotionResults;
