
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import type { EmotionResult } from '@/lib/scanService';

interface EmotionResultDisplayProps {
  result: EmotionResult;
  onPlayMusic: () => void;
}

const EmotionResultDisplay: React.FC<EmotionResultDisplayProps> = ({ result, onPlayMusic }) => {
  const confidence = Math.round(result.confidence * 100);
  
  return (
    <div className="my-4 space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Résultat d'analyse</h3>
      
      <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="font-medium">Émotion détectée:</div>
            <div className="text-xl font-bold">{result.emotion}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">Confiance:</div>
            <div className="text-xl font-bold">{confidence}%</div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={onPlayMusic}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Écouter une playlist adaptée
        </Button>
      </div>
    </div>
  );
};

export default EmotionResultDisplay;
