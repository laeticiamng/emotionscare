// @ts-nocheck

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

interface EmotionScanAnalysisResultProps {
  analysisResult: any;
  onCorrection: () => void;
}

const EmotionScanAnalysisResult: React.FC<EmotionScanAnalysisResultProps> = ({ 
  analysisResult,
  onCorrection
}) => {
  if (!analysisResult) return null;

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Confiance: {Math.round(analysisResult.confidence * 100)}%
        </Badge>
      </div>
      
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Émotion détectée</p>
          <p className="text-2xl font-bold">{analysisResult.emotion}</p>
        </div>
        
        {analysisResult.transcript && (
          <div>
            <p className="text-muted-foreground text-sm">Texte analysé</p>
            <p className="italic">"{analysisResult.transcript}"</p>
          </div>
        )}
      </div>
      
      <Button 
        variant="outline"
        className="gap-2"
        onClick={onCorrection}
      >
        <AlertCircle className="h-4 w-4" />
        Ce n'est pas ce que je ressens
      </Button>
    </div>
  );
};

export default EmotionScanAnalysisResult;
