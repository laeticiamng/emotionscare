
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmotionResult } from '@/types';
import { useMusicRecommendation } from './useMusicRecommendation';
import { Save, PlayCircle, RefreshCw, Volume2 } from 'lucide-react';

interface LiveEmotionResultsProps {
  result: EmotionResult;
  onSave?: () => void;
  onReset?: () => void;
  isSaving?: boolean;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({
  result,
  onSave,
  onReset,
  isSaving = false
}) => {
  const { handlePlayMusic } = useMusicRecommendation();
  
  const getEmotionColor = (emotion: string) => {
    const emotions: Record<string, string> = {
      happy: 'bg-green-500',
      sad: 'bg-blue-500',
      angry: 'bg-red-500',
      anxious: 'bg-yellow-500',
      neutral: 'bg-gray-500',
      calm: 'bg-cyan-500',
      excited: 'bg-violet-500',
      stressed: 'bg-orange-500',
      tired: 'bg-indigo-500'
    };
    
    return emotions[emotion.toLowerCase()] || 'bg-gray-500';
  };
  
  const confidencePercentage = Math.round(result.confidence * 100);
  
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl">Résultats de l'analyse</CardTitle>
          <Badge 
            variant="secondary"
            className="font-normal text-xs"
          >
            {confidencePercentage}% de confiance
          </Badge>
        </div>
        <CardDescription>Analyse basée sur votre voix</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getEmotionColor(result.emotion)}`}>
            <span className="text-xl text-white">{result.emotion === 'happy' ? '😊' : result.emotion === 'sad' ? '😢' : '😐'}</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg capitalize">{result.emotion}</h3>
            <p className="text-sm text-muted-foreground">État émotionnel détecté</p>
          </div>
        </div>
        
        {result.transcript && (
          <div className="bg-secondary/30 p-3 rounded-md">
            <p className="text-sm italic">{result.transcript}</p>
          </div>
        )}
        
        {result.feedback && (
          <div>
            <h4 className="font-medium mb-2">Feedback de l'IA</h4>
            <p className="text-sm">{result.feedback}</p>
          </div>
        )}
        
        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recommandations</h4>
            <ul className="text-sm space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={() => handlePlayMusic(result)}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Musique adaptée
            </Button>
          </div>
          
          <div className="flex gap-2">
            {onReset && (
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Nouvelle analyse
              </Button>
            )}
            
            {onSave && (
              <Button
                onClick={onSave}
                variant="default"
                size="sm"
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEmotionResults;
