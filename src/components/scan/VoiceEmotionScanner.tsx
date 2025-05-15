
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionResult, VoiceEmotionScannerProps } from '@/types';
import { Mic, Square } from 'lucide-react';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onResultsReady,
  onError,
  autoStart = false,
  maxDuration = 30,
  className = "",
  showVisualizer = true
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processAudioData = useCallback(() => {
    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      if (onResultsReady) {
        // Create mock result
        const emotionResult: EmotionResult = {
          id: `scan-${Date.now()}`,
          user_id: 'user-123',
          emotion: ['joy', 'calm', 'focused', 'anxious', 'sad'][Math.floor(Math.random() * 5)],
          score: Math.random() * 0.5 + 0.5,
          confidence: Math.random() * 0.3 + 0.7,
          intensity: Math.random(),
          timestamp: new Date().toISOString(),
          ai_feedback: "Your voice analysis reveals a balanced emotional state with slight tendencies toward the positive spectrum."
        };
        
        onResultsReady(emotionResult);
      }
    }, 1500);
  }, [onResultsReady]);

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
      const steps = (maxDuration * 1000) / interval;
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
  }, [isRecording, maxDuration, stopRecording]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Voice Emotion Scanner</span>
          {isRecording && (
            <span className="text-sm font-normal text-muted-foreground">
              {Math.round((progress / 100) * maxDuration)}s / {maxDuration}s
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
            <p className="text-sm text-muted-foreground mt-2">Analyzing your voice...</p>
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
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Voice Analysis
              </>
            )}
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center max-w-md">
          {isRecording 
            ? "Speak naturally while we analyze your voice patterns..." 
            : "Voice emotion scanning detects emotions through the modulation and tonality of your voice."}
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
