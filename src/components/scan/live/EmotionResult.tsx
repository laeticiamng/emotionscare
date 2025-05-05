
import React from 'react';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import type { EmotionResult as EmotionResultType } from '@/lib/scanService';

interface EmotionResultProps {
  result: EmotionResultType | null;
  onPlayMusic: () => void;
}

const EmotionResult: React.FC<EmotionResultProps> = ({ result, onPlayMusic }) => {
  if (!result) return null;
  
  // Confidence color based on value
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-500';
    if (confidence > 0.6) return 'text-blue-500';
    return 'text-amber-500';
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Analyse émotionnelle</h3>
      <div className="p-4 bg-secondary/20 rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-2xl capitalize">{result.emotion}</span>
          <span className={`text-xl font-semibold ${getConfidenceColor(result.confidence)}`}>
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full flex items-center justify-center gap-2"
          onClick={onPlayMusic}
        >
          <Music className="h-4 w-4" />
          Écouter une playlist adaptée
        </Button>
      </div>
    </div>
  );
};

export default EmotionResult;
