import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Mic, StopCircle } from 'lucide-react';

interface EmotionScanLiveProps {
  isScanning: boolean;
  onStart: () => void;
  onStop: () => void;
  emotionResult?: EmotionResult | null;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({
  isScanning,
  onStart,
  onStop,
  emotionResult
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan émotionnel en direct</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          {isScanning ? (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse"></div>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>
        
        {emotionResult && (
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-1">Émotion détectée</h3>
            <p className="text-lg font-bold">{emotionResult.emotion}</p>
            {emotionResult.confidence && (
              <div className="text-sm text-muted-foreground">
                Confiance: {Math.round(emotionResult.confidence * 100)}%
              </div>
            )}
          </div>
        )}
        
        <Button 
          variant={isScanning ? "destructive" : "default"} 
          className="w-full"
          onClick={isScanning ? onStop : onStart}
        >
          {isScanning ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" /> Arrêter le scan
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" /> Commencer le scan
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Parlez naturellement pendant quelques secondes pour permettre l'analyse de vos émotions à travers votre voix.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
