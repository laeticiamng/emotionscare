
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { EmotionResult } from "@/types/types";
import TranscriptDisplay from "./TranscriptDisplay";

interface LiveVoiceScannerProps {
  onEmotionDetected?: (emotion: EmotionResult, result: EmotionResult) => void;
  className?: string;
}

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onEmotionDetected,
  className
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsListening(false);
    setIsProcessing(false);
  };
  
  const handleProgressUpdate = (message: string) => {
    setProgress(message);
  };
  
  const handleProcessingChange = (processing: boolean) => {
    setIsProcessing(processing);
  };
  
  const handleAnalysisComplete = (emotion: EmotionResult, result: EmotionResult) => {
    if (result.transcript) {
      setTranscript(result.transcript);
    }
    
    // Pass emotion data to parent
    if (onEmotionDetected) {
      onEmotionDetected(emotion, result);
    }
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
    setError(null);
    if (!isListening) {
      setProgress('Initialisation de l\'écoute...');
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Volume2 className="h-5 w-5" />
          Scanner émotionnel vocal
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="text-center py-4">
          <div className="mb-4 text-sm text-muted-foreground">
            Parlez de votre journée ou de comment vous vous sentez pour une analyse émotionnelle en temps réel
          </div>
          
          <Button
            size="lg"
            onClick={toggleListening}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "default"}
            className={`w-16 h-16 rounded-full ${isListening ? 'animate-pulse' : ''}`}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          
          <div className="mt-4">
            {isListening && !isProcessing && (
              <Badge variant="outline" className="animate-pulse">
                Écoute en cours...
              </Badge>
            )}
            {isProcessing && (
              <Badge variant="secondary">
                {progress || 'Traitement en cours...'}
              </Badge>
            )}
            {error && (
              <Badge variant="destructive">
                {error}
              </Badge>
            )}
          </div>
        </div>
        
        {transcript && (
          <TranscriptDisplay transcript={transcript} />
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/20 flex justify-between text-xs text-muted-foreground px-4 py-2">
        <span>La confidentialité est garantie</span>
        <span>Parlez clairement pour de meilleurs résultats</span>
      </CardFooter>
    </Card>
  );
};

export default LiveVoiceScanner;
