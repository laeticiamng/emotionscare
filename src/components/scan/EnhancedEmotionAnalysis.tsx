
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EmotionResult } from '@/types';

interface EnhancedEmotionAnalysisProps {
  result: EmotionResult;
  className?: string;
}

const EnhancedEmotionAnalysis: React.FC<EnhancedEmotionAnalysisProps> = ({ result, className }) => {
  // Assurons-nous que recommendations est bien un tableau de chaînes
  const recommendations = result.recommendations || [];
  
  // Vous pouvez aussi structurer les recommandations si nécessaire
  const structuredRecommendations = {
    activities: recommendations.filter(r => r.includes('activité') || r.includes('exercice')),
    music: recommendations.filter(r => r.includes('musique') || r.includes('son')),
    breathingExercises: recommendations.filter(r => r.includes('respiration') || r.includes('souffle'))
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analyse Émotionnelle Avancée</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Émotion Primaire</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-base py-1 px-3">
              {result.primaryEmotion?.name || result.emotion}
            </Badge>
            <Badge variant="secondary" className="text-base py-1 px-3">
              {Math.round((result.intensity || 0.5) * 100)}% d'intensité
            </Badge>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">Recommandations</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-muted-foreground">{rec}</li>
            ))}
          </ul>
        </div>

        {result.feedback && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-medium">Feedback IA</h3>
              <p className="mt-2 text-muted-foreground">{result.feedback}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedEmotionAnalysis;
