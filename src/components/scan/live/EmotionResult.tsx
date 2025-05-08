
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EmotionResultProps {
  emotion: string;
  confidence: number;
  transcript?: string;
}

const EmotionResult: React.FC<EmotionResultProps> = ({ emotion, confidence, transcript }) => {
  // Fonction pour déterminer la couleur du badge selon l'émotion
  const getBadgeVariant = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'excited':
      case 'joy':
        return 'default'; // bleu/primary
      case 'sad':
      case 'depressed':
        return 'secondary'; // gris
      case 'angry':
      case 'frustrated':
        return 'destructive'; // rouge
      case 'calm':
      case 'relaxed':
        return 'outline'; // contour
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant(emotion)} className="capitalize">
            {emotion}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Confiance: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>
      
      {transcript && (
        <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground">
          <p className="italic">"{transcript}"</p>
        </div>
      )}
    </div>
  );
};

export default EmotionResult;
