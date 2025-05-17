
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { MicIcon } from 'lucide-react';

interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  audioOnly?: boolean;
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
  showVisualizer?: boolean;
  className?: string;
}

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onComplete,
  audioOnly = false,
  onResult,
  duration = 10,
  autoStart = false,
  showVisualizer = true,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(autoStart);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording and processing
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false);
        
        // Generate a mock result
        const result = {
          id: crypto.randomUUID(), // Generate unique ID
          emotion: 'calm',
          score: 0.85,
          confidence: 0.92,
          text: "User audio sample processed successfully.",
          feedback: "You sound calm and balanced. Your voice reflects inner peace.",
        };
        
        if (onResult) onResult(result);
        if (onComplete) onComplete(result);
      }, 2000);
    }, duration * 1000);
  };

  if (autoStart && !isRecording && !isProcessing) {
    startRecording();
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6 text-center">
        <div 
          className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors
            ${isRecording ? 'animate-pulse bg-red-100 dark:bg-red-900' : 
              isProcessing ? 'bg-amber-100 dark:bg-amber-900' : 
              'bg-muted'}`}
        >
          <MicIcon 
            className={`h-10 w-10 
              ${isRecording ? 'text-red-500' : 
                isProcessing ? 'text-amber-500' : 
                'text-muted-foreground'}`} 
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">
            {isRecording ? 'Écoute en cours...' : 
             isProcessing ? 'Analyse en cours...' : 
             'Prêt à analyser votre voix'}
          </h3>
          
          <p className="text-muted-foreground text-sm">
            {isRecording ? `Parlez naturellement pendant ${duration} secondes` : 
             isProcessing ? 'Traitement de votre échantillon vocal' : 
             'Appuyez sur le bouton pour commencer l\'analyse vocale'}
          </p>
        </div>
        
        {!isRecording && !isProcessing && !autoStart && (
          <Button 
            className="mt-6"
            onClick={startRecording}
          >
            Démarrer l'analyse
          </Button>
        )}
        
        {showVisualizer && isRecording && (
          <div className="mt-4 flex justify-center items-end space-x-1 h-8">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="w-1 bg-primary"
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
