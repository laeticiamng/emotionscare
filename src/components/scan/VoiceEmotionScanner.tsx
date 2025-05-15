
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mic } from 'lucide-react';
import { VoiceEmotionScannerProps, EmotionResult } from '@/types';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onResultsReady,
  onError,
  autoStart = false,
  maxDuration = 30,
  className = '',
  showVisualizer = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setError(null);
    // Simulation d'enregistrement pour la démonstration
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxDuration) {
          clearInterval(interval);
          stopRecording();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);

    // Dans un cas réel, on démarrerait ici l'enregistrement audio
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Simulation d'analyse pour la démonstration
    setTimeout(() => {
      const mockResult: EmotionResult = {
        emotion: 'calm',
        confidence: 0.85,
        intensity: 0.6,
        recommendations: [
          'Continuer à pratiquer la pleine conscience',
          'Maintenir un journal d\'émotions quotidien'
        ],
        transcript: 'Aujourd\'hui est une journée agréable et je me sens plutôt bien.',
      };
      
      if (onResultsReady) {
        onResultsReady(mockResult);
      }
    }, 1500);

    // Dans un cas réel, on arrêterait l'enregistrement et on enverrait l'audio à l'API
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setIsRecording(false);
    if (onError) {
      onError(new Error(errorMsg));
    }
  };

  // Démarrage automatique si demandé
  React.useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="mr-2 h-5 w-5" />
          Analyse Vocale des Émotions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="text-center">
            {isRecording ? (
              <>
                <div className="mb-4">
                  <div className="animate-pulse inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20">
                    <Mic className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">Enregistrement en cours...</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {recordingTime} / {maxDuration} secondes
                </p>
                
                {showVisualizer && (
                  <div className="flex items-center justify-center gap-1 h-10 mb-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-primary rounded-full animate-sound"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted">
                    <Mic className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">Prêt à analyser votre voix</p>
                <p className="text-sm text-muted-foreground">
                  Appuyez sur le bouton pour commencer l'enregistrement
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {isRecording ? (
          <Button variant="destructive" onClick={stopRecording}>
            Arrêter l'enregistrement
          </Button>
        ) : (
          <Button onClick={startRecording}>
            Démarrer l'analyse vocale
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoiceEmotionScanner;
