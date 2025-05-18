
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { normalizeEmotionResult } from '@/utils/emotionCompatibility';

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

  // We'll use the normalizeEmotionResult to ensure we have a valid emotion result
  const normalizedResult = result ? normalizeEmotionResult(result) : undefined;
  
  // Convert to percentage for display
  const intensityPercent = normalizedResult ? normalizedResult.intensity * 100 : 0;
  const confidencePercent = normalizedResult ? normalizedResult.confidence * 100 : 0;

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
        
        {!isLoading && !normalizedResult && (
          <div>
            <p>Aucun résultat pour le moment.</p>
          </div>
        )}
        
        {!isLoading && normalizedResult && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Émotion détectée</h3>
              <p className="text-xl font-bold">{normalizedResult.emotion}</p>
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
              <p className="text-xl font-bold">{normalizedResult.score || 'N/A'}</p>
            </div>
            
            {(normalizedResult.feedback || normalizedResult.ai_feedback) && (
              <div>
                <h3 className="text-lg font-medium mb-2">Feedback IA</h3>
                <p className="text-muted-foreground">{normalizedResult.feedback || normalizedResult.ai_feedback}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
