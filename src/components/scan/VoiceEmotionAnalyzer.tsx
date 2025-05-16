
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/scan';
import { Mic, StopCircle } from 'lucide-react';

interface VoiceEmotionAnalyzerProps {
  onResult?: (result: EmotionResult) => void;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      stopRecording();
    }, 5000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      
      if (onResult) {
        const mockResult: EmotionResult = {
          id: 'voice-analysis-' + Date.now(),
          userId: 'user-123',
          emotion: ['joy', 'calm', 'anxious', 'sad'][Math.floor(Math.random() * 4)],
          score: Math.random() * 0.5 + 0.5,
          confidence: Math.random() * 0.3 + 0.7,
          timestamp: new Date().toISOString(),
          recommendations: [
            'Take a 5-minute breathing exercise',
            'Listen to calming music',
            'Write in your journal about your day'
          ],
          ai_feedback: "Your voice pattern suggests you're in a neutral to positive emotional state."
        };
        
        onResult(mockResult);
      }
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse Vocale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse-fast bg-primary/20' : 'bg-muted'}`}></div>
          <div className={`absolute inset-0 rounded-full scale-[0.85] ${isRecording ? 'animate-pulse bg-primary/30' : 'bg-muted/80'}`}></div>
          <div className="absolute inset-0 rounded-full scale-75 bg-background flex items-center justify-center">
            <Mic className={`h-10 w-10 ${isRecording ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
        
        {isAnalyzing ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm">Analyse en cours...</p>
          </div>
        ) : (
          <Button 
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="w-40"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                Arrêter
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Commencer
              </>
            )}
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center max-w-xs mt-4">
          {isRecording 
            ? "Parlez naturellement pendant quelques secondes..." 
            : "Cliquez sur le bouton pour commencer l'enregistrement vocal et l'analyse émotionnelle"}
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;
