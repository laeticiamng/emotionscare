
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Loader2 } from 'lucide-react';
import { VoiceEmotionScannerProps } from '@/types';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onResult,
  autoStart = false,
  duration = 30
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [processing, setProcessing] = useState(false);
  
  // Start recording automatically if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart]);
  
  // Timer countdown when recording
  useEffect(() => {
    let interval: number;
    
    if (isRecording && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      stopRecording();
    }
    
    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);
  
  const startRecording = () => {
    setIsRecording(true);
    setTimeLeft(duration);
    // Actual recording logic would be here
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setProcessing(true);
    
    // Simulate processing delay (in a real app, this would be API call)
    setTimeout(() => {
      setProcessing(false);
      
      // Create a dummy result (in a real app, this would come from API)
      const dummyResult = {
        emotion: 'happy',
        confidence: 0.85,
        transcript: 'This is a sample transcript of what the user said during the emotion analysis.',
      };
      
      onResult(dummyResult);
    }, 2000);
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        {processing ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p>Analyzing your emotions...</p>
          </div>
        ) : isRecording ? (
          <>
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <Mic className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-lg font-medium">{formatTime(timeLeft)}</p>
            <p className="text-muted-foreground text-center">
              Please speak about how you're feeling today...
            </p>
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Mic className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Click to start recording your voice for emotion analysis
            </p>
            <Button onClick={startRecording}>
              <Mic className="h-4 w-4 mr-2" />
              Start Voice Analysis
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
