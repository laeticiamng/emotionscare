
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Glasses } from 'lucide-react';
import { EmotionResult } from '@/types/types';

interface VREmotionRecommendationProps {
  emotion: EmotionResult | null;
}

const VREmotionRecommendation: React.FC<VREmotionRecommendationProps> = ({ emotion }) => {
  if (!emotion) return null;
  
  const getRecommendedSession = (emotionName: string) => {
    const sessions = {
      'calm': 'Méditation tranquille',
      'energetic': 'Énergisation positive',
      'creative': 'Flux créatif',
      'reflective': 'Réflexion profonde',
      'anxious': 'Relaxation anti-stress',
      'sad': 'Réconfort émotionnel',
      'angry': 'Apaisement et lâcher-prise',
      'default': 'Session de bien-être'
    };
    
    return sessions[emotionName.toLowerCase() as keyof typeof sessions] || sessions.default;
  };
  
  const session = getRecommendedSession(emotion.emotion);
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Session VR recommandée</h4>
            <p className="text-sm text-muted-foreground">{session}</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Glasses className="h-4 w-4" />
            Démarrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VREmotionRecommendation;
