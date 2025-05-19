
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  EmotionResult,
  EmotionRecommendation,
  LiveVoiceScannerProps,
} from '@/types/emotion';
import { Mic, Square } from 'lucide-react';


// Helper function to generate a random emotion for mock data
const randomEmotion = (): string => {
  const emotions = ['joy', 'calm', 'focused', 'anxious', 'sad'];
  return emotions[Math.floor(Math.random() * emotions.length)];
};

// Create a mock result generator function
const createMockResult = (): EmotionResult => {
  const detectedEmotion = randomEmotion();
  const recommendations: EmotionRecommendation[] = [
    {
      id: "rec-live-1",
      emotion: "calm",
      type: "activity",
      title: "Exercice de respiration",
      description: "3 minutes de respiration profonde",
      category: "relaxation"
    },
    {
      id: "rec-live-2",
      emotion: "relaxed",
      type: "music",
      title: "Playlist recommandée",
      description: "Musique relaxante pour vous aider à vous détendre",
      category: "music"
    }
  ];

  return {
    id: `voice-${Date.now()}`,
    emotion: detectedEmotion,
    confidence: Math.random() * 0.4 + 0.6,
    intensity: Math.random() * 0.5 + 0.5,
    recommendations: recommendations,
    timestamp: new Date().toISOString(),
    emojis: ["😌", "🧘‍♀️"],
    feedback: "Vous semblez calme et détendu. Continuez ainsi!",
    emotions: { calm: 0.8, happy: 0.2 },
    source: "live-voice",
    score: Math.random() * 100
  };
};

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  onResult,
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing,
  autoStart = false,
  scanDuration = 10
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;

  const processAudioData = useCallback(() => {
    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      if (onScanComplete || onResult) {
        // Create mock result
        const emotionResult = createMockResult();
        
        if (onScanComplete) onScanComplete(emotionResult);
        if (onResult) onResult(emotionResult);
      }
    }, 1500);
  }, [onScanComplete, onResult, setIsProcessing]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setProgress(0);
  }, []);
  
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    processAudioData();
  }, [processAudioData]);

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart, startRecording]);
  
  useEffect(() => {
    let timer: number | null = null;
    
    if (isRecording) {
      const interval = 100; // Update every 100ms for smoother progress
      const steps = (scanDuration * 1000) / interval;
      let currentStep = 0;
      
      timer = window.setInterval(() => {
        currentStep++;
        const newProgress = (currentStep / steps) * 100;
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          stopRecording();
        }
      }, interval);
    }
    
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [isRecording, scanDuration, stopRecording]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Scan vocal en direct</span>
          {isRecording && (
            <span className="text-sm font-normal text-muted-foreground">
              {Math.round((progress / 100) * scanDuration)}s / {scanDuration}s
            </span>
          )}
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="flex flex-col items-center space-y-4 pt-2">
        <div className="relative h-24 w-24">
          <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-pulse bg-primary/20' : 'bg-muted'}`}></div>
          <div className={`absolute inset-0 scale-[0.8] rounded-full ${isRecording ? 'animate-pulse-fast bg-primary/30' : 'bg-muted/80'}`}></div>
          <div className="absolute inset-0 scale-[0.6] rounded-full bg-background flex items-center justify-center">
            <Mic className={`h-10 w-10 ${isRecording || isProcessing ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
        
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Analyse en cours...</p>
          </div>
        ) : (
          <Button 
            variant={isRecording ? "destructive" : "default"}
            disabled={isProcessing}
            onClick={isRecording ? stopRecording : startRecording}
            className="mt-4"
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Arrêter l'enregistrement
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Commencer l'analyse
              </>
            )}
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center max-w-md">
          {isRecording 
            ? "Parlez naturellement pendant que nous analysons votre voix..." 
            : "L'analyse vocale permet de détecter les émotions à travers les modulations et intonations de votre voix."}
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;
