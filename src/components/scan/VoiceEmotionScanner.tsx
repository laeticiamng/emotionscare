
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { VoiceEmotionScannerProps } from '@/types';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onResult, 
  onEmotionDetected,
  autoStart = false,
  duration = 10
}) => {
  const [isRecording, setIsRecording] = React.useState(autoStart);
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart]);

  const startRecording = () => {
    setIsRecording(true);
    // Simule un enregistrement
    setTimeout(() => {
      const mockResult = {
        emotion: 'calm',
        confidence: 0.85,
        triggers: ['respiration calme', 'ton posé'],
        secondary: ['focused', 'content']
      };
      setResult(mockResult);
      setIsRecording(false);
      
      if (onResult) onResult(mockResult);
      if (onEmotionDetected) onEmotionDetected('calm', mockResult);
    }, duration * 300); // Simule la durée * 300ms
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Analyse vocale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">Écoute en cours...</p>
            </div>
          ) : result ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between">
                <span>Émotion détectée:</span>
                <span className="font-medium">{result.emotion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Confiance:</span>
                <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
              </div>
              <Button 
                onClick={startRecording}
                className="w-full mt-4"
                variant="outline"
              >
                <Mic className="mr-2 h-4 w-4" />
                Nouvelle analyse
              </Button>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <p className="text-muted-foreground text-center mb-4">
                Parlez naturellement pendant quelques secondes pour analyser votre état émotionnel.
              </p>
              <Button 
                onClick={startRecording}
                className="w-full"
              >
                <Mic className="mr-2 h-4 w-4" />
                Commencer l'analyse
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
