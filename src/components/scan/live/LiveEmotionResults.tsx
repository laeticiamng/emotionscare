
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, BarChart2 } from 'lucide-react';
import { EmotionResult } from '@/types';
import { Progress } from '@/components/ui/progress';

interface LiveEmotionResultsProps {
  result: EmotionResult;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({ result }) => {
  // Helper function to get emotion badge color
  const getEmotionBadgeColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'joy':
      case 'excited':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sad':
      case 'depressed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'angry':
      case 'frustrated':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'anxious':
      case 'stressed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'calm':
      case 'relaxed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Smile className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Analyse émotionnelle</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <Badge className={`px-2 py-1 ${getEmotionBadgeColor(result.emotion)}`}>
                {result.emotion}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Confiance: {Math.round(result.confidence * 100)}%
              </span>
            </div>
            
            {(result.feedback) && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm">{result.feedback}</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Intensité</span>
              </div>
              <span className="text-sm">{result.score}%</span>
            </div>
            <Progress value={result.score} className="h-2 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEmotionResults;
