// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmotionRecommendation } from '@/types/emotion';
import { Sparkles, Music, Heart, Brain } from 'lucide-react';

interface EmotionRecommendationEngineProps {
  currentEmotion: string | null;
  recommendations: EmotionRecommendation[];
  alternativeRecommendations: EmotionRecommendation[];
}

const EmotionRecommendationEngine: React.FC<EmotionRecommendationEngineProps> = ({
  currentEmotion, recommendations, alternativeRecommendations
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{rec.title}</h4>
                <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              <Button size="sm" variant="outline" className="w-full">
                {rec.type === 'music' ? <Music className="w-3 h-3 mr-1" /> : 
                 rec.type === 'breathing' ? <Heart className="w-3 h-3 mr-1" /> :
                 <Brain className="w-3 h-3 mr-1" />}
                Essayer maintenant
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alternatives Suggérées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alternativeRecommendations.map((rec) => (
            <div key={rec.id} className="p-3 bg-muted/30 rounded-lg">
              <h5 className="font-medium text-sm mb-1">{rec.title}</h5>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionRecommendationEngine;