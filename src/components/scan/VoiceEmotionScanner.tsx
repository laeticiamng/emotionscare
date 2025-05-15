
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { VoiceEmotionScannerProps, EmotionResult } from '@/types/emotion';

export const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onResult,
  duration = 10,
  autoStart = false,
  showVisualizer = true,
  className = ''
}) => {
  const [recording, setRecording] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(duration);
  
  const startRecording = () => {
    setRecording(true);
    setSecondsLeft(duration);
    
    // Simulate recording countdown
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    setRecording(false);
    
    // Mock result for now
    if (onResult) {
      const mockResult: EmotionResult = {
        emotion: 'calm',
        score: 0.85,
        confidence: 0.92,
        text: 'Voice transcript would appear here in a real implementation',
        feedback: 'You sound calm and collected.',
      };
      onResult(mockResult);
    }
  };
  
  // Auto-start recording if configured
  React.useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analyse vocale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showVisualizer && (
          <div className="h-20 bg-secondary/20 rounded-md flex items-center justify-center">
            <div className="flex items-center space-x-1">
              {recording && Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-primary h-8 w-1 animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
              {!recording && <p className="text-muted-foreground">Visualiseur audio</p>}
            </div>
          </div>
        )}
        
        <div className="text-center">
          {recording ? (
            <>
              <p className="mb-2 text-lg font-semibold">{secondsLeft}</p>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={stopRecording}
              >
                <Square className="h-4 w-4" />
                Arrêter l'enregistrement
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              onClick={startRecording}
            >
              <Mic className="h-4 w-4" />
              Commencer l'enregistrement
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
