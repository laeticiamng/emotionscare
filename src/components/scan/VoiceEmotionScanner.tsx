
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

export interface VoiceEmotionScannerProps {
  onResultsReady?: (results: any) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  maxDuration?: number;
  className?: string;
  showVisualizer?: boolean;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onResultsReady,
  className,
  autoStart = false,
  maxDuration = 30
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analyse Vocale</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <Mic className="h-10 w-10 text-primary" />
        </div>
        <Button>Commencer l'enregistrement</Button>
        <p className="text-sm text-muted-foreground text-center">
          Parlez pour analyser votre état émotionnel à travers votre voix
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
