
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';

interface LiveEmotionResultsProps {
  result: EmotionResult | null;
  isLoading?: boolean;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analyse en cours...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Veuillez patienter pendant que nous analysons vos émotions.</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Aucun résultat</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aucune émotion détectée pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculer une valeur d'intensité par défaut si elle n'existe pas
  const displayIntensity = result.intensity !== undefined ? result.intensity : (result.score / 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Résultats de l'analyse</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div>
            <p>Analyse en cours...</p>
          </div>
        )}
        
        {!isLoading && !result && (
          <div>
            <p>Aucun résultat pour le moment.</p>
          </div>
        )}
        
        {!isLoading && result && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Émotion détectée</h3>
              <p className="text-xl font-bold">{result.emotion}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Intensité</h3>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${displayIntensity * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-muted-foreground mt-1">
                {Math.round(displayIntensity * 100)}%
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Score</h3>
              <p className="text-xl font-bold">{result.score || 'N/A'}</p>
            </div>
            
            {(result.feedback || result.ai_feedback) && (
              <div>
                <h3 className="text-lg font-medium mb-2">Feedback IA</h3>
                <p className="text-muted-foreground">{result.feedback || result.ai_feedback}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveEmotionResults;
