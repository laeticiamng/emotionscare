
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square } from 'lucide-react';

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: any) => void;
  autoStart?: boolean;
  scanDuration?: number; // in seconds
  onEmotionDetected?: (emotion: any) => void;
  onTranscriptUpdate?: (transcript: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
  visualizationMode?: 'wave' | 'bars' | 'circle';
}

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  autoStart = false,
  scanDuration = 10,
  className
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Scan vocal en direct</span>
        </CardTitle>
        <Progress value={0} className="h-2" />
      </CardHeader>
      
      <CardContent className="flex flex-col items-center space-y-4 pt-2">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-muted"></div>
          <div className="absolute inset-0 scale-[0.8] rounded-full bg-muted/80"></div>
          <div className="absolute inset-0 scale-[0.6] rounded-full bg-background flex items-center justify-center">
            <Mic className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <Button>
          <Mic className="mr-2 h-4 w-4" />
          Commencer l'analyse
        </Button>
        
        <p className="text-xs text-muted-foreground text-center max-w-md">
          L'analyse vocale permet de détecter les émotions à travers les modulations et intonations de votre voix.
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;
