
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Target, TrendingUp, Share2, Calendar } from 'lucide-react';
import { EmotionResult } from '@/types';

interface PostScanAnalysisProps {
  scanResult: EmotionResult;
  onScheduleFollowUp?: () => void;
  onShareWithCoach?: () => void;
}

const PostScanAnalysis: React.FC<PostScanAnalysisProps> = ({
  scanResult,
  onScheduleFollowUp,
  onShareWithCoach
}) => {
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'joy': 'bg-yellow-100 text-yellow-800',
      'calm': 'bg-blue-100 text-blue-800',
      'stress': 'bg-red-100 text-red-800',
      'sad': 'bg-gray-100 text-gray-800',
      'energetic': 'bg-green-100 text-green-800',
    };
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPersonalizedAdvice = (emotion: string) => {
    const advice: Record<string, string[]> = {
      'stress': [
        'Prenez 5 minutes pour pratiquer la respiration profonde',
        'Écoutez une playlist relaxante',
        'Planifiez une courte pause dans votre journée'
      ],
      'joy': [
        'Partagez cette énergie positive avec vos proches',
        'Profitez de ce moment pour accomplir des tâches importantes',
        'Notez ce qui vous rend heureux dans votre journal'
      ],
      'calm': [
        'Maintenez cet état avec une méditation guidée',
        'C\'est le moment idéal pour de la réflexion',
        'Planifiez vos objectifs de la journée'
      ]
    };
    return advice[emotion.toLowerCase()] || [
      'Prenez un moment pour vous reconnecter avec vous-même',
      'Consultez votre coach IA pour des conseils personnalisés'
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Analyse Personnalisée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={getEmotionColor(scanResult.emotion)}>
              {scanResult.emotion}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Intensité: {scanResult.intensity}%
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Conseils Immédiats
              </h4>
              <ul className="space-y-2">
                {getPersonalizedAdvice(scanResult.emotion).map((advice, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {advice}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tendance Récente
              </h4>
              <div className="text-sm space-y-1">
                <p>Cette semaine: Amélioration de 12%</p>
                <p>Émotion dominante: Calme</p>
                <p>Meilleur moment: Matinée</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button 
              onClick={onShareWithCoach}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Partager avec Coach IA
            </Button>
            <Button 
              onClick={onScheduleFollowUp}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Programmer suivi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostScanAnalysis;
