
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Emotion } from '@/types';

interface EnhancedEmotionAnalysisProps {
  emotion: string | Emotion;
  score?: number;
  confidence?: number;
  triggers?: string[];
  recommendations?: string[];
}

const EnhancedEmotionAnalysis: React.FC<EnhancedEmotionAnalysisProps> = ({
  emotion,
  score,
  confidence,
  triggers = [],
  recommendations = []
}) => {
  // Handle emotion being either a string or an Emotion object
  const emotionName = typeof emotion === 'string' ? emotion : emotion.emotion || 'unknown';
  const emotionScore = score || (typeof emotion !== 'string' ? emotion.score || 0 : 0);
  const confidenceValue = confidence || (typeof emotion !== 'string' && emotion.confidence ? emotion.confidence : 0.8);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Analyse émotionnelle</h2>
          <p className="text-muted-foreground">
            Votre état émotionnel actuel est principalement:
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <Badge variant="outline" className="text-lg px-3 py-2 mb-2">
              {emotionName.charAt(0).toUpperCase() + emotionName.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Intensité: {Math.round(emotionScore * 100)}%
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-right">
            Confiance: {Math.round(confidenceValue * 100)}%
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Déclencheurs</h3>
          {triggers.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {triggers.map((trigger, index) => (
                <li key={index}>{trigger}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun déclencheur détecté.
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Recommandations</h3>
          {recommendations.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune recommandation disponible pour le moment.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEmotionAnalysis;
