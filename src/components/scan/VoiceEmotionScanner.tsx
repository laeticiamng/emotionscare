// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { EmotionResult, VoiceEmotionScannerProps } from '@/types/emotion';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ onEmotionDetected }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = () => {
    setError(null);
    setIsRecording(true);
    
    // Simulate recording for demo purposes
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      processAudio();
    }, 1500);
  };

  const processAudio = () => {
    // Simulate emotion detection
    try {
      // Randomly select an emotion for demonstration
      const emotions = ['happy', 'calm', 'focused', 'anxious', 'tired'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.7 + Math.random() * 0.3; // Random confidence between 0.7 and 1.0
      
      const result: EmotionResult = {
        id: `emotion-${Date.now()}`,
        emotion: randomEmotion,
        confidence: confidence,
        intensity: confidence * 0.8, // Slightly lower than confidence
        timestamp: new Date().toISOString(),
        source: 'voice',
        recommendations: [
          {
            id: `rec-${Date.now()}-1`,
            type: 'exercise',
            title: 'Breathing Exercise',
            description: 'A quick breathing exercise to center yourself',
            emotion: randomEmotion,
            content: 'Breathe in for 4 seconds, hold for 4, exhale for 6.',
            category: 'wellness'
          },
          {
            id: `rec-${Date.now()}-2`,
            type: 'music',
            title: 'Recommended Music',
            description: 'Music to match your current emotional state',
            emotion: randomEmotion,
            content: 'Try listening to some ambient music.',
            category: 'audio'
          }
        ]
      };
      
      onEmotionDetected(result);
    } catch (err) {
      setError('Error processing audio. Please try again.');
    }
    
    setIsProcessing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Voice Emotion Scanner</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-4 text-center">
          <p className="text-muted-foreground">
            {isRecording 
              ? 'Listening to your voice...' 
              : isProcessing 
                ? 'Analyzing your emotions...' 
                : 'Press the microphone button to start voice analysis'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 text-destructive text-sm">
            {error}
          </div>
        )}
        
        <Button 
          onClick={isRecording ? stopRecording : startRecording} 
          className={`rounded-full w-16 h-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
          disabled={isProcessing}
        >
          {isRecording ? (
            <StopCircle className="h-8 w-8" />
          ) : isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          Tip: Speak clearly for better emotion detection
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
