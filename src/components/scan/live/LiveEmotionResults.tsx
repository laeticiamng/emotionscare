import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { normalizeEmotionIntensity } from '@/utils/emotionCompatibility';

export default function LiveEmotionResults({ result, isLoading }: { result?: EmotionResult, isLoading?: boolean }) {
  // Handle null/undefined result
  if (!result && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emotion Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            No emotion detected yet. Please start a scan.
          </div>
        </CardContent>
      </Card>
    );
  }

  // We'll use the normalizeEmotionIntensity function to handle string or number intensity
  const getIntensityPercent = () => {
    if (!result) return 0;
    // Convert to number and multiply by 100 to get percentage
    return normalizeEmotionIntensity(result.intensity) * 100;
  };
  
  // Rest of component remains the same...
  const intensityPercent = getIntensityPercent();
  const confidencePercent = result ? result.confidence * 100 : 0;

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
                  style={{ width: `${intensityPercent}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-muted-foreground mt-1">
                {Math.round(intensityPercent)}%
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
