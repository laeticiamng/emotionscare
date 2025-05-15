
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult, VoiceEmotionScannerProps } from '@/types';
import { Mic, StopCircle } from 'lucide-react';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onScanComplete,
  autoStart = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      // Cleanup any active recording if component unmounts
      if (isRecording) {
        stopRecording();
      }
    };
  }, [autoStart]);
  
  useEffect(() => {
    let timer: number | null = null;
    
    if (isRecording) {
      timer = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 15) { // Auto stop after 15 seconds
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [isRecording]);
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Request microphone access in a real implementation
    // For this mock, we just simulate recording
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate mock result
      const mockResult: EmotionResult = {
        id: 'voice-' + Date.now(),
        user_id: 'user-123',
        emotion: ['joy', 'calm', 'anxious', 'sad', 'neutral'][Math.floor(Math.random() * 5)],
        score: Math.random() * 0.5 + 0.5,
        confidence: Math.random() * 0.3 + 0.7,
        intensity: Math.random() * 0.8 + 0.2,
        transcript: 'This would be the speech-to-text transcript in a real implementation.',
        timestamp: new Date().toISOString(),
        recommendations: [
          'Take a 5-minute breathing exercise',
          'Listen to calming music',
          'Write in your journal about your day'
        ],
        ai_feedback: "Based on your voice patterns, you seem to be in a fairly balanced emotional state today."
      };
      
      if (onScanComplete) {
        onScanComplete(mockResult);
      }
      
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scanner vocal des émotions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-32 w-32 mb-6">
          <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse bg-primary/20' : 'bg-muted'}`}></div>
          <div className={`absolute inset-0 scale-75 rounded-full ${isRecording ? 'animate-pulse-fast bg-primary/30' : 'bg-muted/80'}`}></div>
          <div className="absolute inset-0 scale-[0.6] rounded-full bg-background flex items-center justify-center">
            <Mic className={`h-12 w-12 ${isRecording ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
        
        {isRecording && (
          <div className="text-center mb-4">
            <p className="text-xl font-semibold">{recordingTime}s</p>
            <p className="text-sm text-muted-foreground">Enregistrement en cours...</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="text-center mb-4">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Analyse de votre voix...</p>
          </div>
        )}
        
        {!isRecording && !isProcessing && (
          <Button 
            size="lg" 
            className="w-full mb-4"
            onClick={startRecording}
          >
            <Mic className="mr-2 h-4 w-4" />
            Commencer l'analyse vocale
          </Button>
        )}
        
        {isRecording && (
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full mb-4"
            onClick={stopRecording}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Arrêter l'enregistrement
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {isRecording 
            ? "Parlez naturellement pendant quelques secondes pour une analyse précise de votre état émotionnel." 
            : "L'analyse vocale détecte les émotions à travers les modulations de votre voix, sans enregistrer le contenu."}
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
